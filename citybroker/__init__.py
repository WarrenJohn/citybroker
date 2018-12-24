# Handles all the imports and set up for the app
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
app = Flask(__name__, instance_relative_config=True)
app.config.from_object('citybroker.config')
app.config.from_pyfile('config.py')
"""app.config.from_pyfile('config') loads the instance config.py because the instance_relative_config is True
Documentation:
if set to True relative filenames for loading the config are assumed to be relative to the instance path instead of the application root.

development password set to 1234
"""
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "index"
bcrypt = Bcrypt(app)

from citybroker import routes
