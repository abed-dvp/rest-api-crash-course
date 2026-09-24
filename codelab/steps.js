window.CODELAB_STEPS = [
  {
    id: 1,
    title: "What Is an API?",
    time: "00:00",
    mode: "python",
    learn: "An API is an interface that lets one program ask another program for data or actions.",
    bullets: [
      "Think in terms of client → request → server → response.",
      "The client should not need direct database access.",
      "A REST API exposes resources through URLs and HTTP methods."
    ],
    example: `request = {"method": "GET", "path": "/drinks"}
response = {"status": 200, "data": [{"id": 1, "name": "Coffee"}]}

print(request["method"], request["path"])
print(response["status"])`,
    output: `GET /drinks
200`,
    challenge: "Create a request dictionary with method GET and path /drinks, then print both values.",
    starter: `request = {
    # add method and path
}

# print method and path`,
    solution: `request = {
    "method": "GET",
    "path": "/drinks",
}

print(request["method"], request["path"])`,
    check: `assert request["method"] == "GET", "method should be GET"
assert request["path"] == "/drinks", "path should be /drinks"`,
    takeaway: "An API request combines an HTTP method with a resource URL."
  },
  {
    id: 2,
    title: "JSON as API Data",
    time: "05:15",
    mode: "python",
    learn: "JSON objects map naturally to Python dictionaries, and JSON arrays map naturally to Python lists.",
    bullets: [
      "JSON is a text format used to exchange structured data.",
      "Objects contain key-value pairs.",
      "Arrays contain ordered values or objects."
    ],
    example: `drink = {
    "id": 1,
    "name": "Coffee",
    "description": "Hot and caffeinated",
}

print(drink["name"])`,
    output: "Coffee",
    challenge: "Create a drink dictionary with id=2, name='Tea', and description='Green tea'.",
    starter: `drink = {
    # add the three fields
}

print(drink)`,
    solution: `drink = {
    "id": 2,
    "name": "Tea",
    "description": "Green tea",
}

print(drink)`,
    check: `assert drink == {"id": 2, "name": "Tea", "description": "Green tea"}, "Create the expected drink dictionary"`,
    takeaway: "When Python receives JSON, you usually work with ordinary dictionaries and lists."
  },
  {
    id: 3,
    title: "Why APIs Matter",
    time: "09:15",
    mode: "python",
    learn: "An API separates clients from the server's internal implementation.",
    bullets: [
      "Web, mobile, and other services can reuse the same API.",
      "Clients depend on the API contract instead of database details.",
      "The server can change internals while preserving the external interface."
    ],
    example: `clients = ["web", "mobile", "partner-service"]
endpoint = "/drinks"

for client in clients:
    print(f"{client} -> GET {endpoint}")`,
    output: `web -> GET /drinks
mobile -> GET /drinks
partner-service -> GET /drinks`,
    challenge: "Create a list named clients containing web, mobile, and analytics, then print each client calling GET /drinks.",
    starter: `clients = []

for client in clients:
    pass`,
    solution: `clients = ["web", "mobile", "analytics"]

for client in clients:
    print(f"{client} -> GET /drinks")`,
    check: `assert clients == ["web", "mobile", "analytics"], "Use web, mobile, and analytics in that order"`,
    takeaway: "The API is a shared contract that multiple clients can use."
  },
  {
    id: 4,
    title: "HTTP Methods",
    time: "15:00",
    mode: "python",
    learn: "HTTP methods communicate the action a client wants to perform on a resource.",
    bullets: [
      "GET reads.",
      "POST creates.",
      "PUT updates or replaces a known resource.",
      "DELETE removes."
    ],
    example: `crud = {
    "GET": "read",
    "POST": "create",
    "PUT": "update",
    "DELETE": "delete",
}

print(crud["POST"])`,
    output: "create",
    challenge: "Complete the CRUD mapping for GET, POST, PUT, and DELETE.",
    starter: `crud = {
    "GET": "",
    "POST": "",
    "PUT": "",
    "DELETE": "",
}`,
    solution: `crud = {
    "GET": "read",
    "POST": "create",
    "PUT": "update",
    "DELETE": "delete",
}`,
    check: `assert crud == {"GET":"read","POST":"create","PUT":"update","DELETE":"delete"}, "Check the method-to-CRUD mapping"`,
    takeaway: "The method is part of the meaning of an HTTP request."
  },
  {
    id: 5,
    title: "POST vs PUT",
    time: "16:45",
    mode: "python",
    learn: "POST usually creates under a collection; PUT usually targets a known resource URI.",
    bullets: [
      "POST /drinks asks the server to create a new drink.",
      "PUT /drinks/3 targets drink 3.",
      "PUT is designed to be idempotent when used as a full replacement/update."
    ],
    example: `requests = {
    "create": ("POST", "/drinks"),
    "update": ("PUT", "/drinks/3"),
}

print(requests["create"])
print(requests["update"])`,
    output: `('POST', '/drinks')
('PUT', '/drinks/3')`,
    challenge: "Create create_request and update_request tuples for POST /drinks and PUT /drinks/3.",
    starter: `create_request = ("", "")
update_request = ("", "")`,
    solution: `create_request = ("POST", "/drinks")
update_request = ("PUT", "/drinks/3")`,
    check: `assert create_request == ("POST", "/drinks"), "POST should target /drinks"
assert update_request == ("PUT", "/drinks/3"), "PUT should target /drinks/3"`,
    takeaway: "POST generally creates within a collection; PUT addresses a known resource."
  },
  {
    id: 6,
    title: "Consume Stack Exchange Data",
    time: "20:56",
    mode: "python",
    learn: "When consuming an API, you send parameters, decode JSON, and extract the fields you need.",
    bullets: [
      "requests.get() is used in the runnable script.",
      "Query parameters belong in params.",
      "response.json() becomes Python data.",
      "Always account for missing fields and HTTP errors."
    ],
    example: `data = {
    "items": [
        {"title": "How do APIs work?", "score": 8},
        {"title": "Python requests timeout", "score": 5},
    ]
}

titles = [item["title"] for item in data["items"]]
print(titles)`,
    output: `['How do APIs work?', 'Python requests timeout']`,
    challenge: "From the sample API response, create a titles list containing each question title.",
    starter: `data = {
    "items": [
        {"title": "REST vs RPC", "score": 4},
        {"title": "Flask JSON response", "score": 7},
    ]
}

titles = []
print(titles)`,
    solution: `data = {
    "items": [
        {"title": "REST vs RPC", "score": 4},
        {"title": "Flask JSON response", "score": 7},
    ]
}

titles = [item["title"] for item in data["items"]]
print(titles)`,
    check: `assert titles == ["REST vs RPC", "Flask JSON response"], "Extract the title from every item"`,
    takeaway: "Consuming an API is mostly request construction, response validation, and data extraction."
  },
  {
    id: 7,
    title: "Set Up a Flask API",
    time: "27:44",
    mode: "source",
    learn: "A Flask application starts with an app object that maps incoming requests to Python functions.",
    bullets: [
      "Import Flask.",
      "Create app = Flask(__name__).",
      "Run the server locally for real HTTP requests.",
      "GitHub Pages cannot host the Flask process, so this exercise checks source code."
    ],
    example: `from flask import Flask

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)`,
    output: "Source structure only — run locally with Python.",
    challenge: "Create a Flask app object named app.",
    starter: `from flask import Flask

# create the Flask app here`,
    solution: `from flask import Flask

app = Flask(__name__)`,
    required: ["from flask import Flask", "app = Flask(__name__)"],
    takeaway: "The Flask app object is the central object that receives and routes HTTP requests."
  },
  {
    id: 8,
    title: "GET Request Setup",
    time: "31:13",
    mode: "source",
    learn: "A route connects an HTTP method and URL to a Python function.",
    bullets: [
      "@app.get('/drinks') handles GET /drinks.",
      "The decorated function creates the response.",
      "Routing keeps URL behavior explicit."
    ],
    example: `@app.get("/drinks")
def get_drinks():
    return {"drinks": []}`,
    output: "GET /drinks → {'drinks': []}",
    challenge: "Write a Flask GET route for /drinks with a function named get_drinks.",
    starter: `# assume app already exists

# add the route and function`,
    solution: `@app.get("/drinks")
def get_drinks():
    return {"drinks": []}`,
    requiredAny: [
      ["@app.get("/drinks")", "@app.get('/drinks')"],
      ["def get_drinks"]
    ],
    takeaway: "A route is the bridge between an HTTP request and your Python function."
  },
  {
    id: 9,
    title: "Database Model with SQLAlchemy",
    time: "32:04",
    mode: "source",
    learn: "A SQLAlchemy model describes how a Python object maps to a database table.",
    bullets: [
      "Drink inherits from db.Model.",
      "id is the primary key.",
      "name is required and unique in this project.",
      "description is optional."
    ],
    example: `class Drink(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    description: Mapped[str | None]`,
    output: "Model source structure",
    challenge: "Define a Drink model with id as primary key and a required name field.",
    starter: `class Drink(db.Model):
    pass`,
    solution: `class Drink(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None]`,
    required: ["class Drink(db.Model)", "primary_key=True", "nullable=False"],
    takeaway: "The model defines the database representation of the API resource."
  },
  {
    id: 10,
    title: "GET All Data",
    time: "39:10",
    mode: "source",
    learn: "A collection endpoint queries multiple rows and serializes them into JSON.",
    bullets: [
      "Select Drink rows.",
      "Convert ORM objects to dictionaries.",
      "Return a JSON array."
    ],
    example: `drinks = db.session.execute(
    db.select(Drink).order_by(Drink.id)
).scalars().all()

return jsonify([drink.to_dict() for drink in drinks])`,
    output: "JSON array of drinks",
    challenge: "Query all Drink rows using db.select(Drink), then return them with jsonify.",
    starter: `@app.get("/drinks")
def get_drinks():
    # query and return all drinks
    pass`,
    solution: `@app.get("/drinks")
def get_drinks():
    drinks = db.session.execute(db.select(Drink)).scalars().all()
    return jsonify([drink.to_dict() for drink in drinks])`,
    required: ["db.select(Drink)", ".scalars().all()", "jsonify"],
    takeaway: "Collection endpoints return a serialized list of resources."
  },
  {
    id: 11,
    title: "GET Data by ID",
    time: "41:56",
    mode: "source",
    learn: "A resource endpoint uses a path parameter to select one record.",
    bullets: [
      "Use <int:drink_id> in the Flask path.",
      "Look up the row by primary key.",
      "Return 404 when the resource does not exist."
    ],
    example: `@app.get("/drinks/<int:drink_id>")
def get_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    return jsonify(drink.to_dict())`,
    output: "GET /drinks/1 → one drink or 404",
    challenge: "Create the GET /drinks/<int:drink_id> route and use db.get_or_404.",
    starter: `# add a GET-by-id route here`,
    solution: `@app.get("/drinks/<int:drink_id>")
def get_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    return jsonify(drink.to_dict())`,
    required: ["<int:drink_id>", "db.get_or_404(Drink, drink_id)", "jsonify"],
    takeaway: "A path parameter turns a collection URL into a specific-resource URL."
  },
  {
    id: 12,
    title: "Browser Network Tools",
    time: "44:19",
    mode: "python",
    learn: "Network tools help you inspect the exact request and response instead of guessing what happened.",
    bullets: [
      "Check method and URL.",
      "Check status code.",
      "Inspect request body and response JSON.",
      "Headers and timing often explain failures."
    ],
    example: `network_entry = {
    "method": "GET",
    "url": "/drinks",
    "status": 200,
    "content_type": "application/json",
}

print(network_entry["status"])`,
    output: "200",
    challenge: "Create a network_entry dict for POST /drinks with status 201 and content_type application/json.",
    starter: `network_entry = {
    # fill the fields
}`,
    solution: `network_entry = {
    "method": "POST",
    "url": "/drinks",
    "status": 201,
    "content_type": "application/json",
}`,
    check: `assert network_entry["method"] == "POST"
assert network_entry["url"] == "/drinks"
assert network_entry["status"] == 201
assert network_entry["content_type"] == "application/json"`,
    takeaway: "Inspect the network exchange first: method, URL, status, payload, and response."
  },
  {
    id: 13,
    title: "POST a New Record",
    time: "45:03",
    mode: "source",
    learn: "A POST endpoint reads JSON, validates it, creates a model, and commits the transaction.",
    bullets: [
      "Read JSON with request.get_json().",
      "Validate required fields.",
      "db.session.add() stages the new row.",
      "db.session.commit() persists it.",
      "201 Created is appropriate after successful creation."
    ],
    example: `@app.post("/drinks")
def create_drink():
    payload = request.get_json(silent=True) or {}
    drink = Drink(name=payload["name"])
    db.session.add(drink)
    db.session.commit()
    return jsonify(drink.to_dict()), 201`,
    output: "POST /drinks → 201 Created",
    challenge: "Write the core POST /drinks flow: read JSON, create Drink, add, commit, and return 201.",
    starter: `@app.post("/drinks")
def create_drink():
    # implement creation
    pass`,
    solution: `@app.post("/drinks")
def create_drink():
    payload = request.get_json() or {}
    drink = Drink(name=payload["name"])
    db.session.add(drink)
    db.session.commit()
    return jsonify(drink.to_dict()), 201`,
    required: ["request.get_json", "Drink(", "db.session.add", "db.session.commit", "201"],
    takeaway: "Creating a resource is a pipeline: parse → validate → persist → return the new representation."
  },
  {
    id: 14,
    title: "Test with Postman",
    time: "47:15",
    mode: "python",
    learn: "Postman lets you test an API independently from a frontend application.",
    bullets: [
      "Choose the HTTP method.",
      "Enter the endpoint URL.",
      "Set JSON as the request body.",
      "Inspect status and response."
    ],
    example: `postman_request = {
    "method": "POST",
    "url": "http://127.0.0.1:5000/drinks",
    "json": {"name": "Tea"},
}

print(postman_request["json"])`,
    output: "{'name': 'Tea'}",
    challenge: "Build a Postman-style request dictionary for POST /drinks with an Espresso JSON body.",
    starter: `postman_request = {
    "method": "",
    "url": "",
    "json": {},
}`,
    solution: `postman_request = {
    "method": "POST",
    "url": "http://127.0.0.1:5000/drinks",
    "json": {"name": "Espresso"},
}`,
    check: `assert postman_request["method"] == "POST"
assert postman_request["url"].endswith("/drinks")
assert postman_request["json"] == {"name": "Espresso"}`,
    takeaway: "API clients like Postman isolate backend behavior from frontend code."
  },
  {
    id: 15,
    title: "DELETE Data",
    time: "49:21",
    mode: "source",
    learn: "A DELETE endpoint finds the target resource, removes it from the session, and commits.",
    bullets: [
      "The resource ID belongs in the path.",
      "Return 404 if the resource is missing.",
      "Delete and commit the transaction."
    ],
    example: `@app.delete("/drinks/<int:drink_id>")
def delete_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    db.session.delete(drink)
    db.session.commit()
    return {"deleted": drink_id}`,
    output: "DELETE /drinks/1 → {'deleted': 1}",
    challenge: "Create the DELETE-by-id route using db.get_or_404, db.session.delete, and commit.",
    starter: `# implement DELETE /drinks/<int:drink_id>`,
    solution: `@app.delete("/drinks/<int:drink_id>")
def delete_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    db.session.delete(drink)
    db.session.commit()
    return {"deleted": drink_id}`,
    required: ["@app.delete", "db.get_or_404", "db.session.delete", "db.session.commit"],
    takeaway: "DELETE targets a specific resource and persists its removal."
  },
  {
    id: 16,
    title: "PUT Practice",
    time: "51:46",
    mode: "source",
    learn: "PUT is the final practice step: target an existing resource, apply new state, and commit it.",
    bullets: [
      "Use the resource ID in the URL.",
      "Read the incoming JSON.",
      "Update the model.",
      "Commit and return the updated representation."
    ],
    example: `@app.put("/drinks/<int:drink_id>")
def update_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    payload = request.get_json() or {}
    drink.name = payload["name"]
    db.session.commit()
    return jsonify(drink.to_dict())`,
    output: "PUT /drinks/1 → updated drink",
    challenge: "Implement a PUT route that loads a drink by ID, reads JSON, updates its name, commits, and returns JSON.",
    starter: `# implement PUT /drinks/<int:drink_id>`,
    solution: `@app.put("/drinks/<int:drink_id>")
def update_drink(drink_id):
    drink = db.get_or_404(Drink, drink_id)
    payload = request.get_json() or {}
    drink.name = payload["name"]
    db.session.commit()
    return jsonify(drink.to_dict())`,
    required: ["@app.put", "db.get_or_404", "request.get_json", "drink.name", "db.session.commit", "jsonify"],
    takeaway: "PUT completes CRUD by updating the state of an existing resource."
  }
];