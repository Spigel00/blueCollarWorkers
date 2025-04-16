from flask import Blueprint, request, jsonify
from backend.models import Application, Job, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

applications_bp = Blueprint('applications', __name__)

# Apply to job route
@applications_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply_to_job():
    data = request.get_json()
    user_id = get_jwt_identity()

    # Validate required fields
    if 'job_id' not in data:
        return jsonify({"error": "Missing required field: job_id"}), 400

    # Check if the job exists
    job = Job.query.get(data['job_id'])
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Check if the user has already applied for the job
    existing_application = Application.query.filter_by(user_id=user_id, job_id=data['job_id']).first()
    if existing_application:
        return jsonify({"error": "You have already applied to this job"}), 400

    # Create the application
    new_application = Application(
        job_id=data['job_id'],
        user_id=user_id,
        applied_on=datetime.utcnow()  # Add the applied date
    )
    
    db.session.add(new_application)
    db.session.commit()

    return jsonify({"message": "Applied to job successfully!"}), 201

# Get applications for a specific job route
@applications_bp.route('/job/<int:job_id>', methods=['GET'])
def get_applications_for_job(job_id):
    # Fetch the applications for the job
    applications = Application.query.filter_by(job_id=job_id).all()
    
    if not applications:
        return jsonify({"error": "No applications found for this job"}), 404

    result = [{
        "id": app.id,
        "user_id": app.user_id,
        "status": app.status,
        "applied_on": app.applied_on.strftime('%Y-%m-%d') if app.applied_on else None
    } for app in applications]

    return jsonify(result)

# Get applications for the logged-in user route

@applications_bp.route('/applied', methods=['GET'])
@jwt_required()
def get_user_applications():
    user_id = get_jwt_identity()

    # Fetch the applications for the user
    applications = Application.query.filter_by(user_id=user_id).all()

    if not applications:
        return jsonify({"message": "No applications found for this user"}), 404

    result = []
    for app in applications:
        job = Job.query.get(app.job_id)
        if job:
            result.append({
                "id": app.id,
                "jobId": app.job_id,
                "status": app.status,
                "appliedAt": app.applied_on.strftime('%Y-%m-%d') if app.applied_on else None,
                "jobTitle": job.title,
                "companyName": job.company_name,
                "description": job.description,
                "location": job.location
            })
        else:
            result.append({
                "id": app.id,
                "jobId": app.job_id,
                "status": app.status,
                "appliedAt": app.applied_on.strftime('%Y-%m-%d') if app.applied_on else None,
                "jobTitle": None,
                "companyName": None,
                "description": None,
                "location": None
            })

    return jsonify(result)
