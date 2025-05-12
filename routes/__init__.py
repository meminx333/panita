"""
Routes initialization module - centralizes Namespace imports for Flask-RESTx.
"""
# Importar Namespaces
from .test import api as test_ns


# Lista de Namespaces para registrar en la instancia Api
namespaces = [
    (test_ns, "/api/test")
]

__all__ = [
    "test_ns",
    "namespaces"
]
