'use strict';

const steps = window.CODELAB_STEPS;
const videoBase = 'https://www.youtube.com/watch?v=qbLc5a9jdXo&t=';
const storageKey = 'abed-codelab-rest-api-state-v1';
const themeKey = 'abed-codelab-theme';

let currentIndex = 0;
let state = loadState();
let pyodide = null;
let pythonReady = false;

const els = {
  sidebar: document.getElementById('sidebar'),
  menuButton: document.getElementById('menuButton'),
  stepNav: document.getElementById('stepNav'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  stepNumber: document.getElementById('stepNumber'),
  videoTime: document.getElementById('videoTime'),
  lessonTitle: document.getElementById('lessonTitle'),
  lessonIntro: document.getElementById('lessonIntro'),
  learnBullets: document.getElementById('learnBullets'),
  exampleCode: document.getElementById('exampleCode'),
  expectedOutput: document.getElementById('expectedOutput'),
  challengeText: document.getElementById('challengeText'),
  starterCode: document.getElementById('starterCode'),
  solutionPanel: document.getElementById('solutionPanel'),
  solutionCode: document.getElementById('solutionCode'),
  solutionButton: document.getElementById('solutionButton'),
  resetCode: document.getElementById('resetCode'),
  runPython: document.getElementById('runPython'),
  checkAnswer: document.getElementById('checkAnswer'),
  clearOutput: document.getElementById('clearOutput'),
  runOutput: document.getElementById('runOutput'),
  executionState: document.getElementById('executionState'),
  checkFeedback: document.getElementById('checkFeedback'),
  runtimeStatus: document.getElementById('runtimeStatus'),
  runtimeDot: document.getElementById('runtimeDot'),
  runtimeText: document.getElementById('runtimeText'),
  outputLabel: document.getElementById('outputLabel'),
  prevButton: document.getElementById('prevButton'),
  nextButton: document.getElementById('nextButton'),
  completeButton: document.getElementById('completeButton'),
  resetProgress: document.getElementById('resetProgress'),
  themeButton: document.getElementById('themeButton')
};

const PYTHON_HELPER = `
import ast
import contextlib
import io
import json
import traceback

def __abed_run(code, test_code=""):
    namespace = {"__name__": "__main__"}
    stdout = io.StringIO()
    error_type = None
    error_text = ""
    test_error = ""

    try:
        tree = ast.parse(code, filename="<learner>", mode="exec")

        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stdout):
            if tree.body and isinstance(tree.body[-1], ast.Expr):
                last_expr = tree.body.pop()

                if tree.body:
                    exec(compile(tree, "<learner>", "exec"), namespace)

                value = eval(
                    compile(ast.Expression(last_expr.value), "<learner>", "eval"),
                    namespace,
                )

                if value is not None:
                    print(repr(value))
            else:
                exec(compile(tree, "<learner>", "exec"), namespace)

    except BaseException as exc:
        error_type = type(exc).__name__
        error_text = "".join(
            traceback.format_exception_only(type(exc), exc)
        ).strip()

    namespace["__output__"] = stdout.getvalue()

    if test_code and error_type is None:
        try:
            exec(compile(test_code, "<checks>", "exec"), namespace)
        except BaseException as exc:
            test_error = "".join(
                traceback.format_exception_only(type(exc), exc)
            ).strip()

    return {
        "output": stdout.getvalue(),
        "error_type": error_type,
        "error": error_text,
        "test_error": test_error,
    }
`;

async function initPythonRuntime() {
  try {
    if (typeof window.loadPyodide !== 'function') {
      throw new Error('pyodide.js did not load.');
    }

    pyodide = await window.loadPyodide({
      indexURL: './vendor/pyodide/'
    });

    pyodide.setStdin({ error: true });
    pyodide.runPython(PYTHON_HELPER);

    const version = pyodide.runPython('import sys; sys.version.split()[0]');
    pythonReady = true;
    updateModeUI();

    if (steps[currentIndex].mode === 'python') {
      els.runtimeDot.className = 'runtime-dot ready';
      els.runtimeText.textContent = 'Python ' + String(version) + ' ready in browser';
      els.executionState.textContent = 'Ready';
      els.runOutput.textContent = 'Python is ready. Run your code.';
    }
  } catch (error) {
    pythonReady = false;
    const detail = error && error.message ? error.message : String(error);

    if (steps[currentIndex].mode === 'python') {
      els.runtimeDot.className = 'runtime-dot error';
      els.runtimeText.textContent = 'Python runtime failed to load — ' + detail;
      els.executionState.textContent = 'Runtime error';
      els.runOutput.textContent = detail;
      els.runOutput.classList.add('error-output');
    }

    updateModeUI();
  }
}

async function executePython(code, testCode) {
  if (!pythonReady || !pyodide) {
    throw new Error('Python runtime is still loading.');
  }

  pyodide.globals.set('__abed_user_code', code);
  pyodide.globals.set('__abed_test_code', testCode || '');

  try {
    const jsonResult = pyodide.runPython(
      'json.dumps(__abed_run(__abed_user_code, __abed_test_code))'
    );
    return JSON.parse(String(jsonResult));
  } finally {
    try {
      pyodide.globals.delete('__abed_user_code');
      pyodide.globals.delete('__abed_test_code');
    } catch {}
  }
}

function validateSource(step, code) {
  const missing = [];

  (step.required || []).forEach(function(item) {
    if (!code.includes(item)) missing.push(item);
  });

  (step.requiredAny || []).forEach(function(group) {
    const found = group.some(function(item) {
      return code.includes(item);
    });

    if (!found) missing.push(group.join(' OR '));
  });

  return {
    passed: missing.length === 0,
    missing: missing
  };
}

function updateModeUI() {
  const step = steps[currentIndex];
  const sourceMode = step.mode === 'source';

  els.runPython.hidden = sourceMode;
  els.outputLabel.textContent = sourceMode ? 'SOURCE CHECK' : 'PYTHON OUTPUT';

  if (sourceMode) {
    els.runtimeDot.className = 'runtime-dot ready';
    els.runtimeText.textContent = 'Source exercise — checked in browser';
    els.executionState.textContent = 'Ready';
    els.runOutput.textContent =
      'This step validates Flask/SQLAlchemy source structure. Run api/app.py locally for real HTTP behavior.';
    els.runOutput.classList.remove('error-output');
    els.checkAnswer.disabled = false;
  } else {
    els.runtimeDot.className =
      'runtime-dot ' + (pythonReady ? 'ready' : 'loading');
    els.runtimeText.textContent = pythonReady
      ? 'Python ready in browser'
      : 'Loading Python runtime…';
    els.runPython.disabled = !pythonReady;
    els.checkAnswer.disabled = !pythonReady;
  }
}

function setRunning(isRunning, label) {
  const sourceMode = steps[currentIndex].mode === 'source';

  if (!sourceMode) {
    els.runPython.disabled = isRunning || !pythonReady;
  }

  els.checkAnswer.disabled = isRunning || (!sourceMode && !pythonReady);
  els.executionState.textContent = label || (isRunning ? 'Running…' : 'Ready');
}

function formatExecution(result) {
  const parts = [];
  if (result.output) parts.push(result.output.replace(/\s+$/, ''));
  if (result.error) parts.push(result.error);
  return parts.join('\n') || '(no output)';
}

function clearFeedback() {
  els.checkFeedback.hidden = true;
  els.checkFeedback.className = 'check-feedback';
  els.checkFeedback.textContent = '';
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {
      completed: parsed.completed || {},
      code: parsed.code || {}
    };
  } catch {
    return { completed: {}, code: {} };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function secondsFromTimestamp(value) {
  const parts = value.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function renderNav() {
  els.stepNav.innerHTML = '';

  steps.forEach(function(step, index) {
    const button = document.createElement('button');
    button.className = 'step-link';

    if (index === currentIndex) button.classList.add('active');
    if (state.completed[step.id]) button.classList.add('complete');

    const marker = state.completed[step.id] ? '✓' : String(step.id);

    button.innerHTML =
      '<span class="step-index">' + marker + '</span>' +
      '<span class="step-title">' + escapeHtml(step.title) + '</span>' +
      '<span class="step-time">' + escapeHtml(step.time) + '</span>';

    button.addEventListener('click', function() {
      saveCurrentCode();
      currentIndex = index;
      render();
      els.sidebar.classList.remove('open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    els.stepNav.appendChild(button);
  });
}

function renderLesson() {
  const step = steps[currentIndex];

  els.stepNumber.textContent = 'Step ' + step.id + ' of ' + steps.length;
  els.videoTime.textContent = 'Video ' + step.time + ' ↗';
  els.videoTime.href = videoBase + secondsFromTimestamp(step.time) + 's';
  els.lessonTitle.textContent = step.title;
  els.lessonIntro.textContent = step.learn;

  els.learnBullets.innerHTML = '';
  step.bullets.forEach(function(item) {
    const li = document.createElement('li');
    li.textContent = item;
    els.learnBullets.appendChild(li);
  });

  els.exampleCode.textContent = step.example;
  els.expectedOutput.textContent = step.output;
  els.challengeText.textContent = step.challenge;
  els.solutionCode.textContent = step.solution;
  document.getElementById('takeawayText').textContent = step.takeaway;

  const saved = state.code[step.id];
  els.starterCode.value = typeof saved === 'string' ? saved : step.starter;

  els.solutionPanel.hidden = true;
  els.solutionButton.textContent = 'Show solution';
  clearFeedback();

  els.runOutput.classList.remove('error-output');
  els.prevButton.disabled = currentIndex === 0;
  els.nextButton.disabled = currentIndex === steps.length - 1;

  const done = Boolean(state.completed[step.id]);
  els.completeButton.textContent = done ? 'Completed ✓' : 'Mark step complete';
  els.completeButton.classList.toggle('completed', done);

  updateModeUI();
}

function renderProgress() {
  const completed = steps.filter(function(step) {
    return state.completed[step.id];
  }).length;

  const percent = Math.round((completed / steps.length) * 100);
  els.progressBar.style.width = percent + '%';
  els.progressText.textContent =
    completed + ' of ' + steps.length + ' complete · ' + percent + '%';
}

function render() {
  renderNav();
  renderLesson();
  renderProgress();
}

function saveCurrentCode() {
  const step = steps[currentIndex];
  state.code[step.id] = els.starterCode.value;
  saveState();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

els.starterCode.addEventListener('input', saveCurrentCode);

els.runPython.addEventListener('click', async function() {
  const step = steps[currentIndex];
  if (step.mode !== 'python') return;

  clearFeedback();
  saveCurrentCode();
  setRunning(true, 'Running…');
  els.runOutput.classList.remove('error-output');
  els.runOutput.textContent = 'Running Python…';

  await new Promise(function(resolve) {
    requestAnimationFrame(resolve);
  });

  try {
    const result = await executePython(els.starterCode.value, '');
    els.runOutput.textContent = formatExecution(result);
    els.runOutput.classList.toggle('error-output', Boolean(result.error));
    els.executionState.textContent = result.error ? 'Finished with error' : 'Finished';
  } catch (error) {
    els.runOutput.textContent = error.message || String(error);
    els.runOutput.classList.add('error-output');
    els.executionState.textContent = 'Run failed';
  } finally {
    setRunning(false);
  }
});

els.checkAnswer.addEventListener('click', async function() {
  const step = steps[currentIndex];

  clearFeedback();
  saveCurrentCode();
  setRunning(true, 'Checking…');

  if (step.mode === 'source') {
    const result = validateSource(step, els.starterCode.value);
    const passed = result.passed;

    els.runOutput.classList.toggle('error-output', !passed);
    els.runOutput.textContent = passed
      ? 'Source structure looks good.'
      : 'Missing expected structure:\n- ' + result.missing.join('\n- ');

    els.checkFeedback.hidden = false;
    els.checkFeedback.className =
      'check-feedback ' + (passed ? 'success' : 'failure');
    els.checkFeedback.textContent = passed
      ? 'Correct — the required Flask/SQLAlchemy structure is present.'
      : 'Not yet — add the missing source elements and check again.';

    els.executionState.textContent = passed ? 'Check passed' : 'Check failed';

    if (passed) markPassed(step);
    setRunning(false);
    return;
  }

  els.runOutput.classList.remove('error-output');
  els.runOutput.textContent = 'Running Python and checking your answer…';

  await new Promise(function(resolve) {
    requestAnimationFrame(resolve);
  });

  try {
    const result = await executePython(els.starterCode.value, step.check || '');
    els.runOutput.textContent = formatExecution(result);
    els.runOutput.classList.toggle('error-output', Boolean(result.error));

    let passed = false;
    let feedback = '';

    if (result.error) {
      feedback =
        'Your code raised ' + result.error_type + '. Fix the error and try again.';
    } else if (result.test_error) {
      feedback =
        result.test_error.replace(/^AssertionError:\s*/, '') ||
        'The result does not pass the exercise checks yet.';
    } else {
      passed = true;
      feedback = 'Correct — your code passes the checks.';
    }

    els.checkFeedback.hidden = false;
    els.checkFeedback.className =
      'check-feedback ' + (passed ? 'success' : 'failure');
    els.checkFeedback.textContent = feedback;
    els.executionState.textContent = passed ? 'Check passed' : 'Check failed';

    if (passed) markPassed(step);
  } catch (error) {
    els.runOutput.textContent = error.message || String(error);
    els.runOutput.classList.add('error-output');
    els.executionState.textContent = 'Check failed';
  } finally {
    setRunning(false);
  }
});

function markPassed(step) {
  state.completed[step.id] = true;
  saveState();
  renderNav();
  renderProgress();
  els.completeButton.textContent = 'Completed ✓';
  els.completeButton.classList.add('completed');
}

els.clearOutput.addEventListener('click', function() {
  clearFeedback();
  updateModeUI();
});

els.resetCode.addEventListener('click', function() {
  const step = steps[currentIndex];
  els.starterCode.value = step.starter;
  state.code[step.id] = step.starter;
  saveState();
});

els.solutionButton.addEventListener('click', function() {
  const opening = els.solutionPanel.hidden;
  els.solutionPanel.hidden = !opening;
  els.solutionButton.textContent = opening ? 'Hide solution' : 'Show solution';
});

els.prevButton.addEventListener('click', function() {
  if (currentIndex === 0) return;
  saveCurrentCode();
  currentIndex -= 1;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

els.nextButton.addEventListener('click', function() {
  if (currentIndex >= steps.length - 1) return;
  saveCurrentCode();
  currentIndex += 1;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

els.completeButton.addEventListener('click', function() {
  const step = steps[currentIndex];
  state.completed[step.id] = !state.completed[step.id];
  saveState();
  render();
});

els.resetProgress.addEventListener('click', function() {
  const confirmed = window.confirm(
    'Reset completion progress and practice code for all 16 steps?'
  );

  if (!confirmed) return;

  state = { completed: {}, code: {} };
  saveState();
  render();
});

els.menuButton.addEventListener('click', function() {
  els.sidebar.classList.toggle('open');
});

document.addEventListener('click', function(event) {
  const copy = event.target.closest('[data-copy]');
  if (!copy) return;

  const target = document.getElementById(copy.getAttribute('data-copy'));
  if (!target) return;

  navigator.clipboard.writeText(target.textContent).then(function() {
    const original = copy.textContent;
    copy.textContent = 'Copied';

    setTimeout(function() {
      copy.textContent = original;
    }, 900);
  });
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(themeKey, theme);
}

const savedTheme = localStorage.getItem(themeKey);

if (savedTheme) {
  applyTheme(savedTheme);
} else if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  applyTheme('dark');
}

els.themeButton.addEventListener('click', function() {
  const current =
    document.documentElement.getAttribute('data-theme') || 'light';

  applyTheme(current === 'dark' ? 'light' : 'dark');
});

render();
initPythonRuntime();
