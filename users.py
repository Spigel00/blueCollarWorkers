from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from backend.models import User, Worker, Employer, db

users_bp = Blueprint('users', __name__)

# ✅ Get current user (worker or employer)
@users_bp.route('/me', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
@jwt_required()  # Ensure the user is authenticated
def get_current_user():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response

    user_id = get_jwt_identity()  # Retrieve the user ID from the JWT token
    user = User.query.get(user_id)  # Query User table for worker or employer

    if user:
        return jsonify(user.to_dict())  # Replace with the actual method to convert the user to a dictionary
    else:
        return jsonify({"error": "User not found"}), 404

# ✅ Get user by ID
@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "User not found"}), 404

# ✅ List workers for employers
@users_bp.route('/workers', methods=['GET'])
@jwt_required()
def list_workers():
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'employer':
        return jsonify({"error": "Unauthorized"}), 403

    workers = User.query.filter_by(role='worker').all()
    return jsonify([w.to_dict() for w in workers]), 200

# ✅ Update worker profile
@users_bp.route('/worker/profile', methods=['GET', 'POST'])
@jwt_required()
def worker_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if request.method == 'GET':
        worker = Worker.query.filter_by(user_id=user_id).first()
        if worker:
            return jsonify(worker.to_dict()), 200
        return jsonify({"error": "Worker profile not found"}), 404
        
    # Handle POST
    data = request.get_json()
    worker = Worker.query.filter_by(user_id=user_id).first()
    
    if not worker:
        worker = Worker(
            user_id=user_id,
            name=data.get('name'),
            age=data.get('age'),
            years_experience=data.get('experience'),
            contact_number=data.get('contact_number'),
            email=data.get('email')
        )
        db.session.add(worker)
    else:
        worker.name = data.get('name', worker.name)
        worker.age = data.get('age', worker.age)
        worker.years_experience = data.get('experience', worker.years_experience)
        worker.contact_number = data.get('contact_number', worker.contact_number)
        worker.email = data.get('email', worker.email)
    
    db.session.commit()
    return jsonify(worker.to_dict()), 200

# ✅ Update employer profile
@users_bp.route('/employer/profile', methods=['GET', 'POST'])
@jwt_required()
def employer_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if request.method == 'GET':
        employer = Employer.query.filter_by(user_id=user_id).first()
        if employer:
            return jsonify(employer.to_dict()), 200
        return jsonify({"error": "Employer profile not found"}), 404
        
    # Handle POST
    data = request.get_json()
    employer = Employer.query.filter_by(user_id=user_id).first()
    
    if not employer:
        employer = Employer(
            user_id=user_id,
            name=data.get('name'),
            company_name=data.get('company'),
            address=data.get('address'),
            contact_number=data.get('contact_number'),
            email=data.get('email')
        )
        db.session.add(employer)
    else:
        employer.name = data.get('name', employer.name)
        employer.company_name = data.get('company', employer.company_name)
        employer.address = data.get('address', employer.address)
        employer.contact_number = data.get('contact_number', employer.contact_number)
        employer.email = data.get('email', employer.email)
    
    db.session.commit()
    return jsonify(employer.to_dict()), 200
