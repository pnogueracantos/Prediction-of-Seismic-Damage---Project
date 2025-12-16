from flask import Blueprint, send_from_directory

# Crear el Blueprint
frontend_bp = Blueprint(
    'frontend',
    __name__,
    static_folder='frontend'  # Elimina los '..' para evitar problemas
)

# Ruta para servir index.html en la raíz
@frontend_bp.route('/')
def servir_index():
    return send_from_directory('../frontend', 'index.html')

# Ruta para servir variables.js
@frontend_bp.route('/variables.js')
def servir_variables_js():
    return send_from_directory('../frontend', 'variables.js')

# Ruta dinámica para servir cualquier archivo en cualquier subdirectorio del frontend
@frontend_bp.route('/csv/<path:archivo>')
def servir_csv(archivo):
    return send_from_directory(f'csv', archivo)

# Ruta dinámica para servir index.html en cualquier subdirectorio del frontend
@frontend_bp.route('/<path:subruta>/')
def servir_subruta(subruta):
    return send_from_directory(f'../frontend/{subruta}', 'index.html')

# Ruta dinámica para servir cualquier archivo en cualquier subdirectorio del frontend
@frontend_bp.route('/<path:subruta>/<path:archivo>')
def servir_subruta_index_js(subruta, archivo):
    return send_from_directory(f'../frontend/{subruta}', archivo)
