from flask import Blueprint, request, jsonify
from backend.models import Job, Worker, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from datetime import datetime

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def list_jobs():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response

    try:
        jobs = Job.query.all()
        return jsonify([job.to_dict() for job in jobs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/post', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
@jwt_required()
def post_job():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        data = request.get_json()
        new_job = Job(
            title=data['title'],
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            salary_type=data.get('salary_type', 'yearly'),
            employer_id=get_jwt_identity(),
            job_type=data.get('job_type', 'full-time'),
            deadline_date=datetime.strptime(data['deadline_date'], '%Y-%m-%d') if data.get('deadline_date') else None
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify(new_job.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@jobs_bp.route('/recommendations', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
@jwt_required()
def recommend_jobs():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response

    try:
        # Get current user
        user_id = get_jwt_identity()
        
        # For now, return all jobs
        # In future, implement recommendation logic based on worker's skills and preferences
        jobs = Job.query.all()
        return jsonify([job.to_dict() for job in jobs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
