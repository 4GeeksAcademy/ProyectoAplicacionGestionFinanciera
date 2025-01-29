from flask import Blueprint, request, jsonify
from api.models import db, Finances,Categories, Types, Roles
from flask_cors import CORS


finances_bp = Blueprint('finances', __name__)
CORS(finances_bp)
# Ruta para obtener las categorías
@finances_bp.route('/api/categories', methods=['GET'])
def get_categories():
   categories = Categories.query.all()
   return jsonify([category.serialize() for category in categories ]), 200

# Ruta para obtener los tipos
@finances_bp.route('/api/types', methods=['GET'])
def get_types():
    types = Types.query.all()
    return jsonify([type.serialize() for type in types]), 200

# Ruta para obtener todas las finanzas
@finances_bp.route('/api/finances', methods=['GET'])
def get_finances():
    finances = Finances.query.all()
    return jsonify([finance.serialize() for finance in finances]), 200

#hacer un get para traer administrador y invitado
@finances_bp.route('/api/roles', methods=['GET'])
def get_roles():
    roles = Roles.query.all()
    return jsonify([rol.serialize() for rol in roles]), 200


# Ruta para obtener una finanza específica por ID
@finances_bp.route('/api/finances/<int:id>', methods=['GET'])
def get_finance_by_id(id):
    finance = Finances.query.filter_by(id_finance=id).first()
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    return jsonify(finance.serialize()), 200

# Ruta para crear una nueva finanza
@finances_bp.route('/api/finances', methods=['POST'])
def create_finance():
    data = request.get_json()
    
    # Validación básica de los datos recibidos
    required_fields = ['name', 'amount', 'date', 'id_category', 'id_user', 'id_type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        new_finance = Finances(
            name=data['name'],
            amount=data['amount'],
            date=data['date'],
            description=data.get('description'),
            id_category=data['id_category'],
            id_user=data['id_user'],
            id_type=data['id_type']
        )
        db.session.add(new_finance)
        db.session.commit()
        return jsonify(new_finance.serialize()), 201
    except Exception as e:
        return jsonify({"error": f"An error occurred while creating the finance: {str(e)}"}), 500

# Ruta para actualizar una finanza
@finances_bp.route('/api/finances/<int:id>', methods=['PUT'])
def update_finance(id):
    data = request.get_json()
    finance = Finances.query.get(id)
    
    if not finance:
        return jsonify({"error": "Finance not found"}), 404

    # Validación de los campos recibidos
    required_fields = ['name', 'amount', 'date', 'id_category', 'id_user', 'id_type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        finance.name = data['name']
        finance.amount = data['amount']
        finance.date = data['date']
        finance.description = data.get('description')
        finance.id_category = data['id_category']
        finance.id_user = data['id_user']
        finance.id_type = data['id_type']
        
        db.session.commit()
        return jsonify(finance.serialize()), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while updating the finance: {str(e)}"}), 500

# Ruta para eliminar una finanza
@finances_bp.route('/api/finances/<int:id>', methods=['DELETE'])
def delete_finance(id):
    finance = Finances.query.get(id)
    
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    
    try:
        db.session.delete(finance)
        db.session.commit()
        return jsonify({"message": "Finance deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred while deleting the finance: {str(e)}"}), 500
    