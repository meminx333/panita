"""Ejemplo de limpieza de caché al salir de la aplicación."""
import os
import shutil
import stat

# Función para manejar errores al eliminar carpetas
def handle_remove_error(func, path, exc_info):
    """Maneja errores al eliminar carpetas."""
    exc_info=stat.S_IWRITE
    os.chmod(path, exc_info)  # Cambiar permisos a escritura
    try:
        func(path)  # Reintentar la operación fallida
    except ImportError as e:
        print(f"No se pudo eliminar {path}: {e}")

# Función para limpiar la caché
def limpiar_cache():
    """Limpia las carpetas de caché al salir de la aplicación."""
    # Lista de directorios de caché que deseas limpiar
    cache_dirs = [
        "./__pycache__",
        "./datos/__pycache__",
        "./eventos/__pycache__",
        "./tablero/__pycache__",
        "./movimiento/__pycache__"
    ]
    for cache_dir in cache_dirs:
        if os.path.exists(cache_dir):  # Verifica si la carpeta existe
            shutil.rmtree(cache_dir, onexc=handle_remove_error)  # Usar `onexc` para manejar errores
            print(f"Carpeta de caché {cache_dir} eliminada.")
        else:
            print(f"La carpeta {cache_dir} no existe.")
