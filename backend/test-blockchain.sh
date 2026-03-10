#!/bin/bash
# Test blockchain integration
# Assumes backend is running on port 5001

echo "Testing Donation with Blockchain Integration..."

curl -X POST http://localhost:5001/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "ngoId": "<VALID_NGO_ID>",
    "amount": "0.01",
    "paymentMethod": "crypto",
    "message": "Test blockchain donation"
  }'

echo "\nDone."
