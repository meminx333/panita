"""Tests para las trutas de la aplicacción"""

def test_index(client):
    """Test para la ruta de inicio"""
    response = client.get("/")
    assert b"<title>Tu Juego</title>" in response.data
