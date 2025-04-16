from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=True)
    skills = db.Column(db.String(255), nullable=True)
    company_name = db.Column(db.String(255), nullable=True)

    worker = db.relationship('Worker', backref='user', uselist=False, cascade="all, delete")
    employer = db.relationship('Employer', backref='user', uselist=False, cascade="all, delete")

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "location": self.location,
            "skills": self.skills,
            "company_name": self.company_name,
            "worker": self.worker.to_dict() if self.worker else None,
            "employer": self.employer.to_dict() if self.employer else None
        }

class Worker(db.Model):
    __tablename__ = 'worker'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    years_experience = db.Column(db.Integer)
    contact_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    bio = db.Column(db.String(500), nullable=True)
    profile_picture = db.Column(db.String(200), nullable=True)
    skills = db.Column(db.String(200), nullable=True)
    desired_salary = db.Column(db.Integer, nullable=True)
    preferred_job_titles = db.Column(db.String(200), nullable=True)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "years_experience": self.years_experience,
            "contact_number": self.contact_number,
            "email": self.email,
            "user_id": self.user_id,
            "bio": self.bio,
            "profile_picture": self.profile_picture,
            "skills": self.skills.split(",") if self.skills else [],
            "desired_salary": self.desired_salary,
            "preferred_job_titles": self.preferred_job_titles.split(",") if self.preferred_job_titles else [],
            "location": {
                "city": self.location.split(",")[0].strip() if self.location else None,
                "state": self.location.split(",")[1].strip() if self.location and "," in self.location else None
            } if self.location else None
        }

class Employer(db.Model):
    __tablename__ = 'employer'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    company_logo = db.Column(db.String(200), nullable=True)
    company_size = db.Column(db.String(50), nullable=True)
    industry = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "company_name": self.company_name,
            "contact_number": self.contact_number,
            "email": self.email,
            "user_id": self.user_id,
            "address": {
                "street": self.address.split(",")[0].strip() if self.address else None,
                "city": self.address.split(",")[1].strip() if self.address and len(self.address.split(",")) > 1 else None,
                "state": self.address.split(",")[2].strip() if self.address and len(self.address.split(",")) > 2 else None
            } if self.address else None
        }

class Job(db.Model):
    __tablename__ = 'job'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    salary_min = db.Column(db.Integer, nullable=True)
    salary_max = db.Column(db.Integer, nullable=True)
    salary_type = db.Column(db.String(50), nullable=False)
    posted_date = db.Column(db.DateTime, default=datetime.utcnow)
    employer_id = db.Column(db.Integer, db.ForeignKey('employer.id'), nullable=False)
    
    job_type = db.Column(db.String(50), nullable=False)
    deadline_date = db.Column(db.DateTime, nullable=True)

    employer = db.relationship('Employer', backref='jobs')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "salary": {
                "min": self.salary_min,
                "max": self.salary_max,
                "type": self.salary_type
            },
            "posted_date": self.posted_date.strftime('%Y-%m-%d %H:%M:%S'),
            "employer_id": self.employer_id,
            "job_type": self.job_type,
            "deadline_date": self.deadline_date.strftime('%Y-%m-%d') if self.deadline_date else None
        }

class Application(db.Model):
    __tablename__ = 'application'
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')

    def to_dict(self):
        return {
            "id": self.id,
            "worker_id": self.worker_id,
            "job_id": self.job_id,
            "status": self.status
        }