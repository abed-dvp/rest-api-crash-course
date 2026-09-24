# 🌐 REST API Crash Course — Learn by Building

A hands-on guide to REST API fundamentals, consuming an API with Python, and building a small Flask + SQLAlchemy API.

This repository follows the learning sequence of Caleb Curry's **REST API Crash Course – Introduction + Full Python API Tutorial** while using independently written explanations, exercises, and a modern Flask-SQLAlchemy implementation.

> 🚀 **Live Abed Codelab:** https://abed-dvp.github.io/rest-api-crash-course/  
> 🎥 **Source video:** https://www.youtube.com/watch?v=qbLc5a9jdXo  
> 📓 **Practice notebook:** [`notebook.ipynb`](./notebook.ipynb)

---

## 📚 What You'll Learn

By the end of this crash course, you'll understand:

- what an API is and how clients and servers communicate
- why JSON is commonly used for API data
- why APIs decouple applications
- endpoints and URL parameters
- HTTP methods: `GET`, `POST`, `PUT`, and `DELETE`
- the practical difference between `POST` and `PUT`
- how to consume the Stack Exchange API with Python
- how to build a Flask API
- how to model data with Flask-SQLAlchemy
- how to return all records or one record by ID
- how to create and delete records
- how browser network tools and Postman help debug APIs

---

## 🧭 Video Timeline

| # | Topic | Timestamp |
|---|---|---:|
| 1 | Introduction | 00:00 |
| 2 | API App Example | 05:15 |
| 3 | Why an API Is Important | 09:15 |
| 4 | HTTP Methods | 15:00 |
| 5 | POST vs PUT | 16:45 |
| 6 | Consume the StackOverflow API | 20:56 |
| 7 | Set Up Our Own Python API | 27:44 |
| 8 | GET Request Setup | 31:13 |
| 9 | Database Model with SQLAlchemy | 32:04 |
| 10 | GET Data | 39:10 |
| 11 | GET Data by ID | 41:56 |
| 12 | Developer Tools / Network | 44:19 |
| 13 | POST a New Record | 45:03 |
| 14 | Postman | 47:15 |
| 15 | DELETE Data | 49:21 |
| 16 | Conclusion + PUT Practice | 51:46 |

---

# 1. 🔌 What Is an API? — `00:00`

**API** stands for **Application Programming Interface**. In this course, the useful mental model is:

```text
Client  ──request──▶  API / Server
Client  ◀─response──  API / Server
```

The client does not need direct access to the server's database or internal code. It communicates through an agreed interface.

A REST API usually exposes resources through URLs and uses HTTP to operate on them.

For example:

```text
GET /drinks
```

means: "Give me the drinks resource."

---

# 2. 📦 JSON as API Data — `05:15`

APIs often exchange **JSON** because it maps naturally to data structures in many languages.

JSON:

```json
{
  "id": 1,
  "name": "Coffee",
  "description": "Hot and caffeinated"
}
```

The same shape in Python is a dictionary:

```python
drink = {
    "id": 1,
    "name": "Coffee",
    "description": "Hot and caffeinated",
}
```

A collection is usually represented as an array/list:

```json
[
  {"id": 1, "name": "Coffee"},
  {"id": 2, "name": "Tea"}
]
```

---

# 3. 🧩 Why APIs Matter — `09:15`

An API gives clients a stable contract while hiding implementation details.

A browser, mobile application, or another backend can all call the same API:

```text
Web app ──────┐
Mobile app ───┼──▶ REST API ───▶ Database
Other server ─┘
```

The key benefit is **separation of concerns**. Clients care about the API contract; the server can change internal implementation without requiring every client to understand the database.

---

# 4. 🌍 Endpoints

An **endpoint** is a specific API URL plus an HTTP method.

Examples:

```text
GET    /drinks
GET    /drinks/3
POST   /drinks
DELETE /drinks/3
```

The path can identify either a collection or a specific resource.

In:

```text
/drinks/3
```

`3` is the identifier of one drink.

---

# 5. 🧭 HTTP Methods — `15:00`

A useful CRUD mapping is:

| HTTP method | Typical intent | CRUD |
|---|---|---|
| `GET` | Read data | Read |
| `POST` | Create a new resource | Create |
| `PUT` | Replace/update a resource at a known URI | Update |
| `DELETE` | Remove a resource | Delete |

The method is part of the request. Two requests can use the same URL but have different meanings because their methods differ.

---

# 6. 🆚 POST vs PUT — `16:45`

The important distinction is intent.

### POST

Usually asks the server to create a new resource under a collection:

```http
POST /drinks
```

The server commonly chooses the new resource ID.

### PUT

Usually targets a known resource URI:

```http
PUT /drinks/3
```

A properly designed `PUT` is **idempotent**: repeating the same request should leave the resource in the same final state.

---

# 7. 📥 Consume the Stack Exchange API — `20:56`

The video consumes Stack Overflow data from the Stack Exchange API.

A current example request is:

```python
import requests

url = "https://api.stackexchange.com/2.3/questions"
params = {
    "order": "desc",
    "sort": "activity",
    "site": "stackoverflow",
}

response = requests.get(url, params=params, timeout=10)
response.raise_for_status()

data = response.json()

for question in data["items"][:5]:
    print(question["title"])
```

Important pieces:

- `requests.get(...)` sends an HTTP GET request.
- query parameters are passed through `params`.
- `response.json()` converts JSON into Python dictionaries/lists.
- API code should check the response before assuming data exists.

Run the example:

```bash
python consume_api.py
```

> The Stack Exchange request is a live external API call, so it depends on network access and the service's current availability/rate limits.

---

# 8. 🧪 Build a Flask API — `27:44`

Install the project dependencies:

```bash
python -m venv .venv
```

Activate the environment, then:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
python api/app.py
```

By default Flask serves locally at:

```text
http://127.0.0.1:5000
```

---

# 9. 🛣️ GET Request Setup — `31:13`

Flask maps URLs to Python functions.

```python
@app.get("/drinks")
def get_drinks():
    ...
```

When a client sends:

```http
GET /drinks
```

Flask calls `get_drinks()`.

---

# 10. 🗃️ SQLAlchemy Model — `32:04`

A model maps Python objects to database rows.

This repository uses a modern Flask-SQLAlchemy / SQLAlchemy 2 style:

```python
class Drink(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    description: Mapped[str | None]
```

The model describes the data shape:

```text
Drink
├── id
├── name
└── description
```

---

# 11. 📚 GET All Records — `39:10`

The video demonstrates querying all records. The current implementation in this repository uses the SQLAlchemy 2 style:

```python
drinks = db.session.execute(
    db.select(Drink).order_by(Drink.id)
).scalars().all()
```

Then serialize each object:

```python
return jsonify([drink.to_dict() for drink in drinks])
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Coffee",
    "description": "Hot and caffeinated"
  }
]
```

---

# 12. 🎯 GET by ID — `41:56`

A path parameter identifies one resource:

```python
@app.get("/drinks/<int:drink_id>")
def get_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    return jsonify(drink.to_dict())
```

Request:

```http
GET /drinks/1
```

If the record does not exist, `get_or_404()` returns an HTTP 404 response.

---

# 13. 🔍 Browser Network Tools — `44:19`

The browser's developer tools show what actually travels over the network.

Useful fields to inspect:

- request URL
- HTTP method
- status code
- request headers
- request payload/body
- response headers
- response JSON
- timing

This is one of the fastest ways to debug a frontend talking to an API.

---

# 14. ➕ POST a New Record — `45:03`

A POST request sends JSON to create a resource:

```http
POST /drinks
Content-Type: application/json
```

Body:

```json
{
  "name": "Espresso",
  "description": "Small and strong"
}
```

Flask reads the JSON:

```python
payload = request.get_json(silent=True) or {}
```

Then creates and commits the model:

```python
drink = Drink(
    name=payload["name"],
    description=payload.get("description"),
)

db.session.add(drink)
db.session.commit()
```

A successful creation returns **201 Created** in this repository.

---

# 15. 🧰 Postman — `47:15`

Postman lets you construct HTTP requests without building a frontend first.

For example:

```text
Method: POST
URL:    http://127.0.0.1:5000/drinks
Body:   raw JSON
```

```json
{
  "name": "Tea",
  "description": "Green tea"
}
```

This is useful for separating **API problems** from **frontend problems**.

---

# 16. 🗑️ DELETE Data — `49:21`

Delete a specific resource using its ID:

```python
@app.delete("/drinks/<int:drink_id>")
def delete_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)

    db.session.delete(drink)
    db.session.commit()

    return {"deleted": drink_id}
```

Request:

```http
DELETE /drinks/1
```

---

# 🧠 Source vs Current Implementation

The source video was published in 2020. Its conceptual sequence is preserved here, but library APIs have evolved.

This repository deliberately modernizes the implementation:

- the video demonstrates the older `Model.query`-style SQLAlchemy interface
- current Flask-SQLAlchemy documentation considers that query interface legacy
- this project uses `db.select(...)`, `db.session.execute(...)`, and `db.get_or_404(...)`
- SQLAlchemy 2 introduced `Mapped` and `mapped_column()` as the modern typed declarative style

The learning goal is unchanged: understand the API flow first, then use current library syntax to implement it.

---

# 🧪 Interactive Abed Codelab

The live Codelab follows all 16 video chapters.

It uses two exercise modes:

### Browser Python

Concept, JSON, and API-data exercises run as **real Python** inside the browser using Pyodide/WebAssembly.

### Flask source checks

Flask and SQLAlchemy are server-side frameworks, so GitHub Pages cannot run the actual web server. For those steps, the Codelab validates the structure of the code you write. The complete runnable API is available in `api/app.py`.

**Launch:** https://abed-dvp.github.io/rest-api-crash-course/

---

# 📁 Repository Structure

```text
rest-api-crash-course/
├── README.md
├── notebook.ipynb
├── consume_api.py
├── requirements.txt
├── api/
│   └── app.py
├── codelab/
│   ├── index.html
│   ├── app.js
│   ├── steps.js
│   ├── styles.css
│   └── README.md
├── .github/
│   └── workflows/
│       └── pages.yml
├── index.html
├── .nojekyll
└── .gitignore
```

The Pyodide runtime is downloaded during GitHub Pages deployment and is not committed to the repository.

---

# ▶️ Run Locally

Clone:

```bash
git clone https://github.com/abed-dvp/rest-api-crash-course.git
cd rest-api-crash-course
```

Create an environment:

```bash
python -m venv .venv
```

Install:

```bash
pip install -r requirements.txt
```

Run the Flask API:

```bash
python api/app.py
```

Then try:

```bash
curl http://127.0.0.1:5000/drinks
```

---

# 🎯 Recommended Learning Method

For each chapter:

1. Watch the matching part of the source video.
2. Read the explanation in this README.
3. Open the same step in the Abed Codelab.
4. Write the exercise yourself.
5. Use **Run Python** or **Check answer** depending on the step.
6. Run `api/app.py` locally for the Flask chapters.
7. Test requests using your browser devtools, `curl`, or Postman.

The goal is to understand the complete request/response path, not just memorize Flask syntax.

---

## Credits

Learning sequence inspired by Caleb Curry's **REST API Crash Course – Introduction + Full Python API Tutorial**.

The explanations, examples, exercises, modernized implementation, and validation logic in this repository are independently written for study and practice.
