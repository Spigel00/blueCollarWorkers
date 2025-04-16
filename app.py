import os
import logging
from logging import FileHandler
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
from .models import db, Job, Worker, User
from .routes.auth import auth_bp
from .routes.jobs import jobs_bp
from .routes.users import users_bp
from .routes.applications import applications_bp
from .routes.profiles import profiles_bp

# ✅ Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# ✅ Enable detailed logging
handler = FileHandler('app.log')  # Log to a file
handler.setLevel(logging.INFO)  # You can change to DEBUG for more detailed logs
app.logger.addHandler(handler)

# ✅ CORS: Allow frontend origins with credentials
CORS(app, origins=[
    "http://localhost:8080", 
    "http://localhost:5173"
], supports_credentials=True)

# ✅ JWT Config
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# ✅ Database Config
is_testing = os.environ.get('FLASK_ENV') == 'testing'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "TEST_DATABASE_URI" if is_testing else "DATABASE_URI",
    'mysql://root:Jiraiya%40106@localhost/workforce_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Initialize Extensions
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# Add this after JWT initialization
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

# ✅ Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(jobs_bp, url_prefix='/jobs')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(applications_bp, url_prefix='/applications')
app.register_blueprint(profiles_bp, url_prefix='/profiles')

# ✅ Initialize DB for development
with app.app_context():
    db.create_all()

# ✅ Test-only route (renamed to avoid /jobs conflict)
@app.route('/test/jobs', methods=['GET'])
def get_all_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([job.to_dict() for job in jobs]), 200
    except Exception as e:
        app.logger.error(f"Error fetching jobs: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# ✅ JWT Error Handlers
@jwt.unauthorized_loader
def handle_missing_token(_):
    return jsonify({"error": "Missing or invalid access token"}), 401

@jwt.invalid_token_loader
def handle_invalid_token(_):
    return jsonify({"error": "Invalid token"}), 422

@jwt.expired_token_loader
def handle_expired_token(_, __):
    return jsonify({"error": "Token has expired"}), 401

# ✅ Handle OPTIONS (CORS Preflight)
@app.route("/users/me", methods=["OPTIONS"])
def options_me():
    return '', 200  # Respond with OK status for preflight requests

# ✅ Check for missing environment variables
if not os.getenv("DATABASE_URI"):
    app.logger.error("DATABASE_URI is missing in the .env file")
if not os.getenv("JWT_SECRET_KEY"):
    app.logger.error("JWT_SECRET_KEY is missing in the .env file")

# ✅ Run App
if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "True") == "True"
    app.run(debug=debug_mode, port=5000)
