from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"msg": "username, email and password are required"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"msg": "User with that email or username already exists"}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "user created", "user": user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token, "user": user.to_dict()})
