import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env into environment

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://root:Jiraiya%40106@localhost/workforce_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Load secret keys from .env
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
