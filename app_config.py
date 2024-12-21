"""AI is creating summary for Returns:[type]: [description]"""
from flask import Flask
from flask_talisman import Talisman
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO



app = Flask(__name__, static_url_path="/static", static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
socketio = SocketIO(app)
csp = {
    'default-src': ["'self'", 'https://cdn.socket.io'],
    'script-src': ["'self'", 'https://cdn.socket.io'],

}
Talisman(app, content_security_policy=csp)
