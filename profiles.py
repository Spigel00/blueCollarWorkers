from flask import Blueprint, request, jsonify
from backend.models import db, Worker, Employer
from flask_jwt_extended import jwt_required, get_jwt_identity

profiles_bp = Blueprint('profiles', __name__)

@profiles_bp.route('/profile/worker', methods=['POST'])
@jwt_required()
def create_worker_profile():
    user_id = get_jwt_identity()
    if Worker.query.filter_by(user_id=user_id).first():
        return jsonify({"msg": "Worker profile already exists"}), 400

    data = request.get_json()
    profile = Worker(
        name=data['name'],
        age=data['age'],
        years_experience=data['years_experience'],
        contact_number=data['contact_number'],
        email=data['email'],
        user_id=user_id
    )
    db.session.add(profile)
    db.session.commit()
    return jsonify({"msg": "Worker profile created"}), 201

@profiles_bp.route('/profile/employer', methods=['POST'])
@jwt_required()
def create_employer_profile():
    user_id = get_jwt_identity()
    if Employer.query.filter_by(user_id=user_id).first():
        return jsonify({"msg": "Employer profile already exists"}), 400

    data = request.get_json()
    profile = Employer(
        name=data['name'],
        company_name=data['company_name'],
        address=data['address'],
        contact_number=data['contact_number'],
        email=data['email'],
        user_id=user_id
    )
    db.session.add(profile)
    db.session.commit()
    return jsonify({"msg": "Employer profile created"}), 201

@profiles_bp.route('/workers', methods=['GET'])
@jwt_required()
def get_all_workers():
    return jsonify([worker.to_dict() for worker in Worker.query.all()]), 200

@profiles_bp.route('/employers', methods=['GET'])
@jwt_required()
def get_all_employers():
    return jsonify([employer.to_dict() for employer in Employer.query.all()]), 200
