"""Ejemplo de limpieza de caché al salir de la aplicación."""
import os
import shutil
import stat

# Función para manejar errores al eliminar carpetas
def handle_remove_error(func, path, exc_info):
    """Maneja errores al eliminar carpetas."""
    exc_info=stat.S_IWRITE
    os.chmod(path, exc_info)  # Cambiar permisos a escritura
    func(path)  # Reintentar la operación fallida

# Función para limpiar la caché
def limpiar_cache():
    """Limpia las carpetas de caché al salir de la aplicación."""
    # Lista de directorios de caché que deseas limpiar
    cache_dirs = [
        "__pycache__",
        "utils/__pycache__",
        "eventos/__pycache__",
        "tablero/__pycache__",
        #"components/__pycache__",
        #"components/tablero/__pycache__",
        #"helpers/__pycache__",
        "models/__pycache__"
    ]
    for cache_dir in cache_dirs:
        if os.path.exists(cache_dir):  # Verifica si la carpeta existe
            try:
                shutil.rmtree(
                cache_dir,
                onexc=handle_remove_error
                )  # Usar `onexc` para manejar errores
                print(f"Carpeta de caché {cache_dir} eliminada.")
            except ImportError as e:
                print(f"No se pudo eliminar {cache_dir}: {str(e)}")
        else:
            print(f"La carpeta {cache_dir} no existe.")
