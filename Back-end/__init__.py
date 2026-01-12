import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    # Serve frontend static files by setting Flask static_folder to the FRONTEND directory
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'FRONTEND'))
    app = Flask(__name__, static_folder=static_dir, static_url_path='')
    app.config.from_object('app.config.Config')

    # extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')

    # serve index from frontend folder when available
    @app.route('/')
    def index():
        try:
            return app.send_static_file('HOME.html')
        except Exception:
            return {"message": "E-commerce backend (Flask). See README for usage."}

    # fallback for any frontend files
    @app.route('/<path:path>')
    def static_proxy(path):
        try:
            return app.send_static_file(path)
        except Exception:
            return app.send_static_file('HOME.html')

    return app
