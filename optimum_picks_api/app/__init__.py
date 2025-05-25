from flask import Flask
from .routes.api import api_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints or routes here


    app.register_blueprint(api_bp)
    return app 