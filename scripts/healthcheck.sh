#!/bin/bash

# Health check script for AMOR E-Commerce
# Tests all services with timeout

TIMEOUT=5
HOST="127.0.0.1"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  AMOR E-Commerce Health Check"
echo "=========================================="
echo ""

# Check Docker containers
echo "📦 Checking Docker containers..."
if docker ps --format '{{.Names}}' | grep -q "amor-db"; then
    echo -e "   ${GREEN}✓${NC} amor-db is running"
else
    echo -e "   ${RED}✗${NC} amor-db is NOT running"
fi

if docker ps --format '{{.Names}}' | grep -q "amor-api"; then
    echo -e "   ${GREEN}✓${NC} amor-api is running"
else
    echo -e "   ${RED}✗${NC} amor-api is NOT running"
fi

if docker ps --format '{{.Names}}' | grep -q "amor-web"; then
    echo -e "   ${GREEN}✓${NC} amor-web is running"
else
    echo -e "   ${RED}✗${NC} amor-web is NOT running"
fi

echo ""

# Check PostgreSQL
echo "🐘 Checking PostgreSQL (port 5432)..."
if timeout $TIMEOUT bash -c "echo > /dev/tcp/$HOST/5432" 2>/dev/null; then
    echo -e "   ${GREEN}✓${NC} PostgreSQL port is open"
else
    echo -e "   ${RED}✗${NC} PostgreSQL port is NOT responding (timeout: ${TIMEOUT}s)"
fi

echo ""

# Check API health endpoint
echo "🔌 Checking API (http://$HOST:3001/api/health)..."
API_RESPONSE=$(timeout $TIMEOUT curl -s -o /dev/null -w "%{http_code}" http://$HOST:3001/api/health 2>/dev/null)
if [ "$API_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} API is healthy (HTTP 200)"
    API_DATA=$(timeout $TIMEOUT curl -s http://$HOST:3001/api/health 2>/dev/null)
    echo "   Response: $API_DATA"
elif [ -z "$API_RESPONSE" ] || [ "$API_RESPONSE" = "000" ]; then
    echo -e "   ${RED}✗${NC} API is NOT responding (timeout: ${TIMEOUT}s)"
else
    echo -e "   ${YELLOW}⚠${NC} API responded with HTTP $API_RESPONSE"
fi

echo ""

# Check API products endpoint
echo "📦 Checking Products API (http://$HOST:3001/api/products)..."
PRODUCTS_RESPONSE=$(timeout $TIMEOUT curl -s -o /dev/null -w "%{http_code}" http://$HOST:3001/api/products 2>/dev/null)
if [ "$PRODUCTS_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Products API is working (HTTP 200)"
    PRODUCT_COUNT=$(timeout $TIMEOUT curl -s http://$HOST:3001/api/products 2>/dev/null | grep -o '"id"' | wc -l)
    echo "   Found approximately $PRODUCT_COUNT products"
elif [ -z "$PRODUCTS_RESPONSE" ] || [ "$PRODUCTS_RESPONSE" = "000" ]; then
    echo -e "   ${RED}✗${NC} Products API is NOT responding (timeout: ${TIMEOUT}s)"
else
    echo -e "   ${YELLOW}⚠${NC} Products API responded with HTTP $PRODUCTS_RESPONSE"
fi

echo ""

# Check Frontend
echo "🌐 Checking Frontend (http://$HOST:3000)..."
WEB_RESPONSE=$(timeout $TIMEOUT curl -s -o /dev/null -w "%{http_code}" http://$HOST:3000 2>/dev/null)
if [ "$WEB_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Frontend is serving (HTTP 200)"
elif [ -z "$WEB_RESPONSE" ] || [ "$WEB_RESPONSE" = "000" ]; then
    echo -e "   ${RED}✗${NC} Frontend is NOT responding (timeout: ${TIMEOUT}s)"
else
    echo -e "   ${YELLOW}⚠${NC} Frontend responded with HTTP $WEB_RESPONSE"
fi

echo ""
echo "=========================================="
echo "  Health Check Complete"
echo "=========================================="

