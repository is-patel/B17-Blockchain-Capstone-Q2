#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test addresses
ESCROW_AGENT="0x5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
BUYER_ADDRESS="0x3a4e6f7d8c9b0a1e2f3d4c5b6a7f8e9d0c1b2a3"
SELLER_ADDRESS="0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3"

# Function to print section header
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to check if server is running
check_server() {
    if ! curl -s "http://localhost:5001" > /dev/null; then
        echo -e "${RED}Error: Escrow server is not running on port 5001${NC}"
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

print_header "TESTING ESCROW SERVICE ENDPOINTS"

# Test 1: Create new escrow
test_endpoint "Create new escrow" "curl -s -X POST http://localhost:5001/create_escrow \
-H 'Content-Type: application/json' \
-H 'X-Agent-Key: $ESCROW_AGENT' \
-d '{
    \"buyer\": \"$BUYER_ADDRESS\",
    \"seller\": \"$SELLER_ADDRESS\",
    \"property_id\": 2,
    \"amount\": 100000
}'" 200

# Test 2: Check escrow status
test_endpoint "Check escrow status" "curl -s -X GET http://localhost:5001/escrow_status/2" 200

# Test 3: Deposit funds
test_endpoint "Deposit funds" "curl -s -X POST http://localhost:5001/deposit_funds \
-H 'Content-Type: application/json' \
-H 'X-Buyer-Address: $BUYER_ADDRESS' \
-d '{
    \"property_id\": 2,
    \"amount\": 100000
}'" 200

# Test 4: Check escrow status after deposit
test_endpoint "Check escrow status after deposit" "curl -s -X GET http://localhost:5001/escrow_status/2" 200

# Test 5: Release funds
test_endpoint "Release funds" "curl -s -X POST http://localhost:5001/release_funds \
-H 'Content-Type: application/json' \
-H 'X-Agent-Key: $ESCROW_AGENT' \
-d '{
    \"property_id\": 2
}'" 200

print_header "TESTING ERROR CASES"

# Test 6: Try to create escrow without agent key (should fail)
test_endpoint "Create escrow without agent key" "curl -s -X POST http://localhost:5001/create_escrow \
-H 'Content-Type: application/json' \
-d '{
    \"buyer\": \"$BUYER_ADDRESS\",
    \"seller\": \"$SELLER_ADDRESS\",
    \"property_id\": 6,
    \"amount\": 200000
}'" 401

# Test 7: Try to deposit wrong amount (should fail)
test_endpoint "Deposit wrong amount" "curl -s -X POST http://localhost:5001/deposit_funds \
-H 'Content-Type: application/json' \
-H 'X-Buyer-Address: $BUYER_ADDRESS' \
-d '{
    \"property_id\": 2,
    \"amount\": 90000
}'" 400

# Test 8: Try to release funds with wrong agent key (should fail)
test_endpoint "Release funds with wrong agent key" "curl -s -X POST http://localhost:5001/release_funds \
-H 'Content-Type: application/json' \
-H 'X-Agent-Key: wrong_key' \
-d '{
    \"property_id\": 2
}'" 401

print_header "TEST SUMMARY"
echo "Completed all escrow service tests!"