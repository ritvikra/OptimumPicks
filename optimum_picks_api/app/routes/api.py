from flask import Blueprint, render_template, request, jsonify


api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/')
def root_route():
    return jsonify({'message': 'This is the root of the Optimum Picks API'})

@api_bp.route('/picks')
def get_picks():
    return jsonify({'message': 'Hello, World!'})
