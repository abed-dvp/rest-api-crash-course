# Abed Codelab — REST API Crash Course

Interactive companion for the REST API crash-course repository.

**Live:** https://abed-dvp.github.io/rest-api-crash-course/

## Exercise modes

The Codelab deliberately uses two modes.

### Browser Python

JSON, dictionaries, HTTP-data transformations, and request-building concepts run as real Python in the browser with Pyodide/WebAssembly.

### Source checks

Flask and Flask-SQLAlchemy need a server process. GitHub Pages is static hosting, so those exercises validate the source code you write instead of pretending to run a Flask server in the browser.

The complete runnable server is in:

```text
api/app.py
```

## Runtime

GitHub Actions downloads the Pyodide runtime during deployment and puts it in:

```text
codelab/vendor/pyodide/
```

The runtime is served from the same GitHub Pages origin.

## Local Flask API

```bash
pip install -r requirements.txt
python api/app.py
```

Then open:

```text
http://127.0.0.1:5000/drinks
```
