from flask import Blueprint, request, jsonify
from app import db
from app.models import Product, User
from flask_jwt_extended import jwt_required, get_jwt_identity

products_bp = Blueprint('products', __name__)


@products_bp.route('/', methods=['GET'])
def list_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products])


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"msg": "admin privilege required"}), 403

    data = request.json or {}
    title = data.get('title')
    price = data.get('price')

    if not title or price is None:
        return jsonify({"msg": "title and price are required"}), 400

    product = Product(title=title, description=data.get('description', ''), price=float(price))
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"msg": "admin privilege required"}), 403

    product = Product.query.get_or_404(product_id)
    data = request.json or {}
    product.title = data.get('title', product.title)
    product.description = data.get('description', product.description)
    if data.get('price') is not None:
        product.price = float(data.get('price'))
    db.session.commit()
    return jsonify(product.to_dict())


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"msg": "admin privilege required"}), 403

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "deleted"})
