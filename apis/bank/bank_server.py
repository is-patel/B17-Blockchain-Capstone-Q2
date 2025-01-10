from flask import Flask, request, jsonify
from dataclasses import dataclass
from typing import Dict, Optional
from datetime import datetime
import secrets

app = Flask(__name__)

# Simulating blockchain address generation
def generate_address() -> str:
    return '0x' + secrets.token_hex(20)

# Data structure to mirror the Solidity contract's Loan struct
@dataclass
class Loan:
    is_approved: bool
    is_repaid: bool
    amount: float
    property_id: int
    term_in_months: int
    monthly_installment: float

# Global state variables (simulating blockchain state)
admin_address = '0x8f42a25c9fd394a778df02e0f56d691e4f4ddf9e'
interest_rate = 5  # 5% interest rate
loans: Dict[str, Loan] = {}

def calculate_monthly_installment(amount: float, term_in_months: int) -> float:
    """Calculate monthly installment with interest"""
    total_amount = amount + (amount * interest_rate / 100)
    return total_amount / term_in_months

@app.route('/apply_loan', methods=['POST'])
def apply_loan():
    data = request.json
    buyer_address = data.get('buyer_address', generate_address())
    property_id = data.get('property_id')
    amount = data.get('amount')
    term_in_months = data.get('term_in_months')

    if not all([property_id, amount, term_in_months]):
        return jsonify({'error': 'Missing required parameters'}), 400

    if buyer_address in loans and loans[buyer_address].amount > 0:
        return jsonify({'error': 'Loan already exists for this buyer'}), 400

    monthly_installment = calculate_monthly_installment(amount, term_in_months)
    
    loans[buyer_address] = Loan(
        is_approved=False,
        is_repaid=False,
        amount=amount,
        property_id=property_id,
        term_in_months=term_in_months,
        monthly_installment=monthly_installment
    )

    return jsonify({
        'status': 'success',
        'event': 'LoanApplied',
        'buyer': buyer_address,
        'property_id': property_id,
        'amount': amount,
        'monthly_installment': monthly_installment
    })

@app.route('/approve_loan', methods=['POST'])
def approve_loan():
    data = request.json
    admin_key = request.headers.get('X-Admin-Key')
    buyer_address = data.get('buyer_address')

    if not admin_key or admin_key != admin_address:
        return jsonify({'error': 'Unauthorized access'}), 401

    if not buyer_address or buyer_address not in loans:
        return jsonify({'error': 'Invalid buyer address'}), 400

    loan = loans[buyer_address]
    if loan.is_approved:
        return jsonify({'error': 'Loan already approved'}), 400

    loan.is_approved = True

    return jsonify({
        'status': 'success',
        'event': 'LoanApproved',
        'buyer': buyer_address,
        'property_id': loan.property_id
    })

@app.route('/reject_loan', methods=['POST'])
def reject_loan():
    data = request.json
    admin_key = request.headers.get('X-Admin-Key')
    buyer_address = data.get('buyer_address')

    if not admin_key or admin_key != admin_address:
        return jsonify({'error': 'Unauthorized access'}), 401

    if not buyer_address or buyer_address not in loans:
        return jsonify({'error': 'Invalid buyer address'}), 400

    loan = loans[buyer_address]
    loan.is_approved = False
    loan.is_repaid = True

    return jsonify({
        'status': 'success',
        'event': 'LoanRejected',
        'buyer': buyer_address,
        'property_id': loan.property_id
    })

@app.route('/repay_loan', methods=['POST'])
def repay_loan():
    data = request.json
    admin_key = request.headers.get('X-Admin-Key')
    buyer_address = data.get('buyer_address')

    if not admin_key or admin_key != admin_address:
        return jsonify({'error': 'Unauthorized access'}), 401

    if not buyer_address or buyer_address not in loans:
        return jsonify({'error': 'Invalid buyer address'}), 400

    loan = loans[buyer_address]
    if not loan.is_approved:
        return jsonify({'error': 'Loan not approved'}), 400

    loan.is_repaid = True

    return jsonify({
        'status': 'success',
        'event': 'LoanRepaid',
        'buyer': buyer_address,
        'property_id': loan.property_id
    })

@app.route('/loan_status/<buyer_address>', methods=['GET'])
def loan_status(buyer_address):
    if buyer_address not in loans:
        return jsonify({'error': 'Loan not found'}), 404

    loan = loans[buyer_address]
    return jsonify({
        'is_approved': loan.is_approved and not loan.is_repaid,
        'loan_details': {
            'amount': loan.amount,
            'property_id': loan.property_id,
            'term_in_months': loan.term_in_months,
            'monthly_installment': loan.monthly_installment,
            'is_repaid': loan.is_repaid
        }
    })

if __name__ == '__main__':
    app.run(debug=True)