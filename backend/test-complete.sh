#!/bin/bash

# Complete End-to-End Test for NGO Fund Management API

BASE_URL="http://localhost:5001/api"
echo "🎯 NGO Fund Management API - Complete E2E Test"
echo "================================================"
echo ""

# Test 1: Health Check
echo "✅ Test 1: Health Check"
HEALTH=$(curl -s $BASE_URL/health)
if echo $HEALTH | grep -q "success"; then
    echo "   ✓ API is running"
else
    echo "   ✗ API health check failed"
    exit 1
fi
echo ""

# Test 2: Login
echo "✅ Test 2: User Login"
LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN | jq -r '.token')
USER_NAME=$(echo $LOGIN | jq -r '.user.name')

if [ "$TOKEN" != "null" ]; then
    echo "   ✓ Login successful - User: $USER_NAME"
    echo "   ✓ Token received: ${TOKEN:0:30}..."
else
    echo "   ✗ Login failed"
    exit 1
fi
echo ""

# Test 3: Get Current User
echo "✅ Test 3: Get Current User Profile"
USER=$(curl -s $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN")

USER_EMAIL=$(echo $USER | jq -r '.user.email')
if [ "$USER_EMAIL" == "john@example.com" ]; then
    echo "   ✓ User profile retrieved: $USER_EMAIL"
else
    echo "   ✗ Failed to get user profile"
    exit 1
fi
echo ""

# Test 4: Get All NGOs
echo "✅ Test 4: Get All NGOs"
NGOS=$(curl -s $BASE_URL/ngos)
NGO_COUNT=$(echo $NGOS | jq '.count')
FIRST_NGO_NAME=$(echo $NGOS | jq -r '.data[0].name')
FIRST_NGO_ID=$(echo $NGOS | jq -r '.data[0]._id')

if [ "$NGO_COUNT" -gt 0 ]; then
    echo "   ✓ Found $NGO_COUNT NGOs"
    echo "   ✓ First NGO: $FIRST_NGO_NAME"
else
    echo "   ✗ No NGOs found"
    exit 1
fi
echo ""

# Test 5: Get Single NGO
echo "✅ Test 5: Get Single NGO Details"
SINGLE_NGO=$(curl -s $BASE_URL/ngos/$FIRST_NGO_ID)
NGO_NAME=$(echo $SINGLE_NGO | jq -r '.data.name')
NGO_TARGET=$(echo $SINGLE_NGO | jq -r '.data.targetAmount')

if [ "$NGO_NAME" != "null" ]; then
    echo "   ✓ NGO Details: $NGO_NAME"
    echo "   ✓ Target Amount: ₹$NGO_TARGET"
else
    echo "   ✗ Failed to get NGO details"
    exit 1
fi
echo ""

# Test 6: Make a Donation
echo "✅ Test 6: Make a Donation"
DONATION=$(curl -s -X POST $BASE_URL/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"ngoId\": \"$FIRST_NGO_ID\",
    \"amount\": 5000,
    \"paymentMethod\": \"credit-card\",
    \"message\": \"Test donation - Keep up the great work!\",
    \"isAnonymous\": false
  }")

DONATION_AMOUNT=$(echo $DONATION | jq -r '.data.amount')
DONATION_ID=$(echo $DONATION | jq -r '.data._id')
TRANSACTION_ID=$(echo $DONATION | jq -r '.data.transactionId')

if [ "$DONATION_AMOUNT" == "5000" ]; then
    echo "   ✓ Donation successful: ₹$DONATION_AMOUNT"
    echo "   ✓ Transaction ID: $TRANSACTION_ID"
else
    echo "   ✗ Donation failed"
    exit 1
fi
echo ""

# Test 7: Get My Donations
echo "✅ Test 7: Get Donation History"
MY_DONATIONS=$(curl -s $BASE_URL/donations \
  -H "Authorization: Bearer $TOKEN")

DONATION_COUNT=$(echo $MY_DONATIONS | jq '.count')
if [ "$DONATION_COUNT" -gt 0 ]; then
    echo "   ✓ Found $DONATION_COUNT donation(s) in history"
else
    echo "   ✗ Failed to get donation history"
    exit 1
fi
echo ""

# Test 8: Get Donation Statistics
echo "✅ Test 8: Get Donation Statistics"
STATS=$(curl -s $BASE_URL/donations/stats/me \
  -H "Authorization: Bearer $TOKEN")

TOTAL_DONATIONS=$(echo $STATS | jq -r '.data.totalDonations')
TOTAL_AMOUNT=$(echo $STATS | jq -r '.data.totalAmount')

if [ "$TOTAL_DONATIONS" != "null" ]; then
    echo "   ✓ Total Donations: $TOTAL_DONATIONS"
    echo "   ✓ Total Amount: ₹$TOTAL_AMOUNT"
else
    echo "   ✗ Failed to get statistics"
    exit 1
fi
echo ""

# Test 9: Get NGO Statistics
echo "✅ Test 9: Get NGO Statistics"
NGO_STATS=$(curl -s $BASE_URL/ngos/stats/overview)

TOTAL_NGOS=$(echo $NGO_STATS | jq -r '.data.totalNGOs')
TOTAL_RAISED=$(echo $NGO_STATS | jq -r '.data.totalRaised')

if [ "$TOTAL_NGOS" -gt 0 ]; then
    echo "   ✓ Total NGOs: $TOTAL_NGOS"
    echo "   ✓ Total Raised: ₹$TOTAL_RAISED"
else
    echo "   ✗ Failed to get NGO statistics"
    exit 1
fi
echo ""

# Test 10: Filter NGOs by Category
echo "✅ Test 10: Filter NGOs by Category"
EDUCATION_NGOS=$(curl -s "$BASE_URL/ngos?category=education")
EDU_COUNT=$(echo $EDUCATION_NGOS | jq '.count')

if [ "$EDU_COUNT" -gt 0 ]; then
    echo "   ✓ Found $EDU_COUNT education NGO(s)"
else
    echo "   ✗ Failed to filter NGOs"
    exit 1
fi
echo ""

# Summary
echo ""
echo "================================================"
echo "🎉 All Tests Passed Successfully!"
echo "================================================"
echo ""
echo "📊 Test Summary:"
echo "   ✓ Health Check"
echo "   ✓ User Authentication"
echo "   ✓ User Profile"
echo "   ✓ List NGOs"
echo "   ✓ NGO Details"
echo "   ✓ Create Donation"
echo "   ✓ Donation History"
echo "   ✓ Donation Statistics"
echo "   ✓ NGO Statistics"
echo "   ✓ Filter by Category"
echo ""
echo "✅ Backend API is fully functional!"
echo ""
