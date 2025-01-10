#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test addresses
ADMIN_ADDRESS="0x8f42a25c9fd394a778df02e0f56d691e4f4ddf9e"
BUYER_ADDRESS="0x3a4e6f7d8c9b0a1e2f3d4c5b6a7f8e9d0c1b2a3"

# Function to print section header
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to check if server is running
check_server() {
    if ! curl -s "http://localhost:5000" > /dev/null; then
        echo -e "${RED}Error: Loan processing server is not running on port 5000${NC}"
        exit 1
    fi
}

# Function to test endpoint and check response
test_endpoint() {
    local description=$1
    local command=$2
    local expected_status=$3
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    echo "Command: $command"
    
    # Execute the curl command with added options to capture HTTP status code
    local output=$(eval $command' -w "\n%{http_code}" 2>/dev/null')
    local curl_status=$?
    
    # Check for connection errors first
    if [ $curl_status -ne 0 ]; then
        echo -e "${RED}✗ Failed${NC}"
        echo "Error: Could not connect to server"
        echo "----------------------------------------"
        return 1
    fi
    
    # Extract status code from the last line
    local status_code=$(echo "$output" | tail -n1)
    # Extract response body (excluding the status code line)
    local response=$(echo "$output" | sed '$d')
    
    # Check if we got a valid status code
    if [[ ! $status_code =~ ^[0-9]+$ ]]; then
        echo -e "${RED}✗ Failed${NC}"
        echo "Error: Invalid response from server"
        echo "----------------------------------------"
        return 1
    fi
    
    # Check if status code matches expected
    if [ -n "$expected_status" ] && [ "$status_code" -ne "$expected_status" ]; then
        echo -e "${RED}✗ Failed${NC}"
        echo "Expected status $expected_status but got $status_code"
        echo "Response: $response"
        echo "----------------------------------------"
        return 1
    fi
    
    # Check for success (2xx status codes)
    if [ $status_code -ge 200 ] && [ $status_code -lt 300 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
    
    echo "Status Code: $status_code"
    echo "Response: $response"
    echo "----------------------------------------"
    
    # Add a small delay between requests
    sleep 1
}

# Check if server is running before starting tests
check_server

print_header "TESTING LOAN PROCESSING SERVICE ENDPOINTS"

# Test 1: Apply for loan
test_endpoint "Apply for loan" "curl -s -X POST http://localhost:5000/apply_loan \
-H 'Content-Type: application/json' \
-d '{\"buyer_address\": \"$BUYER_ADDRESS\",\"property_id\": 123,\"amount\": 100000,\"term_in_months\": 12}'" 200

# Test 2: Check loan status before approval
test_endpoint "Check loan status before approval" \
"curl -s -X GET http://localhost:5000/loan_status/$BUYER_ADDRESS" 200

# Test 3: Try to approve loan without admin key (should fail)
test_endpoint "Approve loan without admin key" "curl -s -X POST http://localhost:5000/approve_loan \
-H 'Content-Type: application/json' \
-d '{\"buyer_address\": \"$BUYER_ADDRESS\"}'" 401

# Test 4: Approve loan with admin key
test_endpoint "Approve loan with admin key" "curl -s -X POST http://localhost:5000/approve_loan \
-H 'Content-Type: application/json' \
-H 'X-Admin-Key: $ADMIN_ADDRESS' \
-d '{\"buyer_address\": \"$BUYER_ADDRESS\"}'" 200

# Test 5: Check loan status after approval
test_endpoint "Check loan status after approval" \
"curl -s -X GET http://localhost:5000/loan_status/$BUYER_ADDRESS" 200

# Test 6: Try to approve already approved loan (should fail)
test_endpoint "Approve already approved loan" "curl -s -X POST http://localhost:5000/approve_loan \
-H 'Content-Type: application/json' \
-H 'X-Admin-Key: $ADMIN_ADDRESS' \
-d '{\"buyer_address\": \"$BUYER_ADDRESS\"}'" 400

print_header "TESTING LOAN REJECTION FLOW"

# Test 7: Apply for another loan with different buyer
test_endpoint "Apply for second loan" "curl -s -X POST http://localhost:5000/apply_loan \
-H 'Content-Type: application/json' \
-d '{\"buyer_address\": \"0x1234567890abcdef1234567890abcdef12345678\",\"property_id\": 124,\"amount\": 200000,\"term_in_months\": 24}'" 200

# Test 8: Reject loan
test_endpoint "Reject loan" "curl -s -X POST http://localhost:5000/reject_loan \
-H 'Content-Type: application/json' \
-H 'X-Admin-Key: $ADMIN_ADDRESS' \
-d '{\"buyer_address\": \"0x1234567890abcdef1234567890abcdef12345678\"}'" 200

print_header "TESTING LOAN REPAYMENT"

# Test 9: Repay loan
test_endpoint "Repay loan" "curl -s -X POST http://localhost:5000/repay_loan \
-H 'Content-Type: application/json' \
-H 'X-Admin-Key: $ADMIN_ADDRESS' \
-d '{\"buyer_address\": \"$BUYER_ADDRESS\"}'" 200

print_header "TESTING ERROR CASES"

# Test 10: Try to apply loan with missing parameters
test_endpoint "Apply loan with missing parameters" "curl -s -X POST http://localhost:5000/apply_loan \
-H 'Content-Type: application/json' \
-d '{\"property_id\": 126,\"amount\": 100000}'" 400

# Test 11: Check status of non-existent loan
test_endpoint "Check non-existent loan status" \
"curl -s -X GET http://localhost:5000/loan_status/0x9876543210abcdef9876543210abcdef98765432" 404

print_header "TEST SUMMARY"
echo "Completed all loan processing tests!"