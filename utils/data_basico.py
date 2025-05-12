"""Database connection module."""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.pool import Pool

db = SQLAlchemy()
class Database:
    """Database connection class"""

    @staticmethod
    def db_connection(app):
        """Connects to the database and returns the connection instance"""

        @event.listens_for(Pool, 'checkout')
        def check_connection(dbapi_connection, connection_record, connection_proxy):
            try:
                cursor = dbapi_connection.cursor()
                cursor.execute('SELECT 1')
                cursor.close()
                print(connection_proxy)
            except Exception:
                connection_record.invalidate()
                raise

        print("Establishing database connection...")
        db.init_app(app)
        Database.db = db  # Guarda la instancia
        print("Database connection established successfully.")
        return db

    @staticmethod
    def get_db_instance():
        """Returns the database instance"""
        return db

    @staticmethod
    def close_session():
        """Closes the database session"""
        Database.db.session.remove()
        print("Database session closed successfully.")
