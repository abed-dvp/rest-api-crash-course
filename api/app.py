"""Small REST API used by the crash-course exercises."""

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///drinks.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


class Drink(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    description: Mapped[str | None]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }


@app.get("/")
def home():
    return {
        "message": "REST API Crash Course",
        "endpoints": ["/drinks", "/drinks/<id>"],
    }


@app.get("/drinks")
def get_drinks():
    drinks = db.session.execute(
        db.select(Drink).order_by(Drink.id)
    ).scalars().all()

    return jsonify([drink.to_dict() for drink in drinks])


@app.get("/drinks/<int:drink_id>")
def get_drink(drink_id: int):
    drink = db.get_or_404(Drink, drink_id)
    return jsonify(drink.to_dict())


@app.post("/drinks")
def create_drink():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()

    if not name:
        return {"error": "name is required"}, 400

    drink = Drink(
        name=name,
        description=payload.get("description"),
    )

    db.session.add(drink)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "drink name already exists"}, 409

    return jsonify(drink.to_dict()), 201


@app.put("/drinks/<int:drink_id>")
def update_drink(drink_id: int):
    drink = db.get_or_404(Drink, drink_id)
    payload = request.get_json(silent=True) or {}

    if "name" in payload:
        name = str(payload["name"]).strip()
        if not name:
            return {"error": "name cannot be empty"}, 400
        drink.name = name

    if "description" in payload:
        drink.description = payload["description"]

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "drink name already exists"}, 409

    return jsonify(drink.to_dict())


@app.delete("/drinks/<int:drink_id>")
def delete_drink(drink_id: int):
    drink = db.get_or_404(Drink, drink_id)
    db.session.delete(drink)
    db.session.commit()

    return {"deleted": drink_id}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
