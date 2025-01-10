from flask import Flask, request, jsonify
from dataclasses import dataclass
from typing import Dict
import requests

app = Flask(__name__)

# Example addresses for testing
ESCROW_AGENT = "0x5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
REAL_ESTATE_TOKEN = "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
PROPERTY_TRANSFER = "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
LOAN_PROCESSING_URL = "http://localhost:5000"  # URL of the loan processing service

@dataclass
class Escrow:
    buyer: str
    seller: str
    property_id: int
    amount: float
    funds_deposited: bool
    completed: bool

# Simulated blockchain state
escrows: Dict[int, Escrow] = {}  # propertyId -> Escrow
balances: Dict[str, float] = {}  # address -> balance

# Mock interfaces
def verify_ownership(owner: str, property_id: int) -> bool:
    # Mock implementation - in real world, this would call the RealEstateToken contract
    # For testing, assume all properties with even IDs are owned by their sellers
    return property_id % 2 == 0

def check_loan_approval(buyer: str) -> bool:
    # Call the loan processing service
    try:
        response = requests.get(f"{LOAN_PROCESSING_URL}/loan_status/{buyer}")
        if response.status_code == 200:
            return response.json()['is_approved']
        return False
    except:
        return False

def finalize_transfer(buyer: str, seller: str, property_id: int) -> bool:
    # Mock implementation - in real world, this would call the PropertyTransfer contract
    return True

@app.route('/create_escrow', methods=['POST'])
def create_escrow():
    data = request.json
    agent_key = request.headers.get('X-Agent-Key')
    
    if not agent_key or agent_key != ESCROW_AGENT:
        return jsonify({'error': 'Unauthorized access'}), 401

    buyer = data.get('buyer')
    seller = data.get('seller')
    property_id = data.get('property_id')
    amount = data.get('amount')

    if not all([buyer, seller, property_id, amount]):
        return jsonify({'error': 'Missing required parameters'}), 400

    if property_id in escrows and escrows[property_id].funds_deposited:
        return jsonify({'error': 'Escrow already exists for this property'}), 400

    escrows[property_id] = Escrow(
        buyer=buyer,
        seller=seller,
        property_id=property_id,
        amount=amount,
        funds_deposited=False,
        completed=False
    )

    return jsonify({
        'status': 'success',
        'message': 'Escrow created',
        'escrow': {
            'buyer': buyer,
            'seller': seller,
            'property_id': property_id,
            'amount': amount
        }
    })

@app.route('/deposit_funds', methods=['POST'])
def deposit_funds():
    data = request.json
    property_id = data.get('property_id')
    amount = data.get('amount')
    buyer = request.headers.get('X-Buyer-Address')

    if property_id not in escrows:
        return jsonify({'error': 'Escrow not found'}), 404

    escrow = escrows[property_id]
    
    if buyer != escrow.buyer:
        return jsonify({'error': 'Only buyer can deposit funds'}), 401

    if escrow.funds_deposited:
        return jsonify({'error': 'Funds already deposited'}), 400

    if amount != escrow.amount:
        return jsonify({'error': 'Incorrect deposit amount'}), 400

    balances[buyer] = balances.get(buyer, 0) + amount
    escrow.funds_deposited = True

    return jsonify({
        'status': 'success',
        'event': 'DepositFunds',
        'buyer': buyer,
        'amount': amount,
        'property_id': property_id
    })

@app.route('/release_funds', methods=['POST'])
def release_funds():
    data = request.json
    agent_key = request.headers.get('X-Agent-Key')
    property_id = data.get('property_id')

    if not agent_key or agent_key != ESCROW_AGENT:
        return jsonify({'error': 'Unauthorized access'}), 401

    if property_id not in escrows:
        return jsonify({'error': 'Escrow not found'}), 404

    escrow = escrows[property_id]

    if not escrow.funds_deposited:
        return jsonify({'error': 'Funds not yet deposited'}), 400

    if escrow.completed:
        return jsonify({'error': 'Transaction already completed'}), 400

    # Verify ownership and loan approval
    if not verify_ownership(escrow.seller, property_id):
        return jsonify({'error': 'Seller does not own the property'}), 400

    if not check_loan_approval(escrow.buyer):
        return jsonify({'error': 'Loan not approved'}), 400

    # Finalize transfer
    if not finalize_transfer(escrow.buyer, escrow.seller, property_id):
        return jsonify({'error': 'Property transfer failed'}), 500

    # Transfer funds
    balances[escrow.buyer] -= escrow.amount
    escrow.completed = True
    # In a real implementation, this would trigger actual fund transfer
    
    return jsonify({
        'status': 'success',
        'event': 'ReleaseFunds',
        'seller': escrow.seller,
        'amount': escrow.amount,
        'property_id': property_id
    })

@app.route('/refund_funds', methods=['POST'])
def refund_funds():
    data = request.json
    agent_key = request.headers.get('X-Agent-Key')
    property_id = data.get('property_id')

    if not agent_key or agent_key != ESCROW_AGENT:
        return jsonify({'error': 'Unauthorized access'}), 401

    if property_id not in escrows:
        return jsonify({'error': 'Escrow not found'}), 404

    escrow = escrows[property_id]

    if not escrow.funds_deposited:
        return jsonify({'error': 'Funds not yet deposited'}), 400

    if escrow.completed:
        return jsonify({'error': 'Transaction already completed'}), 400

    # Process refund
    balances[escrow.buyer] -= escrow.amount
    escrow.completed = True
    # In a real implementation, this would trigger actual fund transfer

    return jsonify({
        'status': 'success',
        'event': 'RefundFunds',
        'buyer': escrow.buyer,
        'amount': escrow.amount,
        'property_id': property_id
    })

@app.route('/escrow_status/<int:property_id>', methods=['GET'])
def escrow_status(property_id):
    if property_id not in escrows:
        return jsonify({'error': 'Escrow not found'}), 404

    escrow = escrows[property_id]
    return jsonify({
        'buyer': escrow.buyer,
        'seller': escrow.seller,
        'property_id': escrow.property_id,
        'amount': escrow.amount,
        'funds_deposited': escrow.funds_deposited,
        'completed': escrow.completed
    })

if __name__ == '__main__':
    app.run(port=5001)  # Run on port 5001 to avoid conflict with loan processing service