#!/bin/bash

# NGO Fund Management API Test Script
# This script demonstrates the complete API workflow

BASE_URL="http://localhost:5001/api"
echo "🧪 Testing NGO Fund Management API at $BASE_URL"
echo ""

# 1. Health Check
echo "1️⃣ Health Check..."
curl -s $BASE_URL/health | jq
echo ""

# 2. Login
echo "2️⃣ Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "🔑 Token: ${TOKEN:0:30}..."
echo ""

# 3. Get All NGOs
echo "3️⃣ Getting all NGOs..."
curl -s $BASE_URL/ngos | jq '.data[:2]'
echo ""

# 4. Get Current User
echo "4️⃣ Getting current user profile..."
curl -s $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 5. Get My Donations
echo "5️⃣ Getting my donations..."
curl -s $BASE_URL/donations \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 6. Get NGO Stats
echo "6️⃣ Getting NGO statistics..."
curl -s $BASE_URL/ngos/stats/overview | jq
echo ""

echo "✅ All tests completed!"
