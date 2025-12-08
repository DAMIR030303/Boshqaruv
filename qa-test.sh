#!/bin/bash

# Manual QA Testing Helper Script
# Bu script QA testing jarayonini avtomatlashtiradi

echo "🧪 BOSHQARUV.UZ - MANUAL QA TESTING"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Results
PASSED=0
FAILED=0
TOTAL=0

# Test function
test_case() {
    TOTAL=$((TOTAL + 1))
    echo -e "${YELLOW}[TEST $TOTAL]${NC} $1"
    echo "Steps: $2"
    read -p "Test o'tdimi? (y/n): " result
    if [ "$result" == "y" ]; then
        PASSED=$((PASSED + 1))
        echo -e "${GREEN}✅ PASSED${NC}"
    else
        FAILED=$((FAILED + 1))
        echo -e "${RED}❌ FAILED${NC}"
        read -p "Xato tavsifi: " error
        echo "$TOTAL. $1 - FAILED: $error" >> qa_results.txt
    fi
    echo ""
}

# Clear previous results
> qa_results.txt

echo "📋 QA Testing boshlandi..."
echo "Natijalar qa_results.txt faylida saqlanadi"
echo ""

# Start dev server check
echo "🚀 Dev server ishga tushirilganmi?"
read -p "pnpm dev ishga tushiring va Enter bosing..."
echo ""

# ==========================================
# 1. AUTHENTICATION TESTS
# ==========================================
echo "🔐 AUTHENTICATION TESTS"
echo "========================"

test_case "TC-AUTH-001: Login - Valid Credentials" "1. Login sahifasiga o'ting\n2. To'g'ri credentials kiriting\n3. Dashboard'ga yo'naltirilishni tekshiring"

test_case "TC-AUTH-002: Login - Invalid Credentials" "1. Noto'g'ri credentials kiriting\n2. Error message tekshiring"

test_case "TC-AUTH-003: Logout" "1. Profile → Chiqish\n2. ConfirmationDialog tekshiring\n3. Login'ga qaytishni tekshiring"

# ==========================================
# 2. DASHBOARD TESTS
# ==========================================
echo "📊 DASHBOARD TESTS"
echo "=================="

test_case "TC-DASH-001: Dashboard Load" "1. Dashboard yuklanishini kuzating\n2. SkeletonLoader'ni tekshiring\n3. Statistikalar to'g'ri yuklanishini tekshiring"

test_case "TC-DASH-002: Quick Actions" "1. Quick action bosing\n2. Modal/sahifa ochilishini tekshiring"

# ==========================================
# 3. TASK MANAGEMENT TESTS
# ==========================================
echo "✅ TASK MANAGEMENT TESTS"
echo "========================"

test_case "TC-TASK-001: Create Task" "1. Tasks → Yangi vazifa\n2. Form to'ldiring\n3. Success animation tekshiring"

test_case "TC-TASK-002: Update Task" "1. Task'ni edit qiling\n2. O'zgarishlarni saqlang\n3. List yangilanishini tekshiring"

test_case "TC-TASK-003: Delete Task" "1. Delete bosing\n2. ConfirmationDialog tekshiring\n3. O'chirilishini tekshiring"

test_case "TC-TASK-004: Empty State" "1. Barcha tasklar o'chirilgandan keyin\n2. EmptyState ko'rinishini tekshiring"

# ==========================================
# 4. UI COMPONENTS TESTS
# ==========================================
echo "🎨 UI COMPONENTS TESTS"
echo "======================"

test_case "TC-UI-001: ConfirmationDialog" "1. Biror delete action\n2. Dialog keyboard shortcuts (Enter/Escape)\n3. Dark mode tekshiring"

test_case "TC-UI-002: SuccessAnimation" "1. Save action bajaring\n2. Success animation kuzating\n3. Auto-hide tekshiring"

test_case "TC-UI-003: OnboardingFlow" "1. LocalStorage tozalang\n2. Refresh qiling\n3. 4 ta slide tekshiring"

# ==========================================
# 5. MULTI-LANGUAGE TESTS
# ==========================================
echo "🌐 MULTI-LANGUAGE TESTS"
echo "======================="

test_case "TC-LANG-001: Language Switch" "1. Settings → Language\n2. Uzbek → English → Russian\n3. Barcha textlar tarjimani tekshiring"

# ==========================================
# 6. DARK MODE TESTS
# ==========================================
echo "🌙 DARK MODE TESTS"
echo "=================="

test_case "TC-DARK-001: Dark Mode Toggle" "1. Settings → Theme\n2. Light → Dark → Light\n3. Barcha komponentlarni tekshiring"

# ==========================================
# 7. RESPONSIVE TESTS
# ==========================================
echo "📱 RESPONSIVE TESTS"
echo "==================="

test_case "TC-RESP-001: Mobile View (375px)" "1. DevTools → Device toolbar → iPhone SE\n2. Bottom navigation tekshiring\n3. Touch targets >44px"

test_case "TC-RESP-002: Tablet View (768px)" "1. iPad view\n2. Layout adjust tekshiring"

test_case "TC-RESP-003: Desktop View (1920px)" "1. Desktop view\n2. Sidebar visible tekshiring"

# ==========================================
# 8. REAL-TIME TESTS
# ==========================================
echo "⚡ REAL-TIME TESTS"
echo "=================="

test_case "TC-RT-001: Real-time Updates" "1. 2 ta tab oching\n2. Birida task yarating\n3. Ikkinchida ko'rinishini tekshiring"

# ==========================================
# 9. ERROR HANDLING TESTS
# ==========================================
echo "🐛 ERROR HANDLING TESTS"
echo "======================="

test_case "TC-ERR-001: Network Error" "1. DevTools → Network → Offline\n2. ErrorState tekshiring"

test_case "TC-ERR-002: 404 Page" "1. /non-existent-page oching\n2. 404 page tekshiring"

# ==========================================
# RESULTS
# ==========================================
echo ""
echo "========================================="
echo "🎯 QA TESTING NATIJALARI"
echo "========================================="
echo -e "Total Tests:  ${TOTAL}"
echo -e "${GREEN}Passed:       ${PASSED}${NC}"
echo -e "${RED}Failed:       ${FAILED}${NC}"
echo ""

PASS_RATE=$(( PASSED * 100 / TOTAL ))
echo "Pass Rate: ${PASS_RATE}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ BARCHA TESTLAR O'TDI!${NC}"
    echo -e "${GREEN}🚀 Production'ga chiqarish mumkin!${NC}"
else
    echo -e "${RED}❌ Ba'zi testlar muvaffaqiyatsiz${NC}"
    echo "Xatolarni qa_results.txt faylida ko'ring"
    echo ""
    cat qa_results.txt
fi

echo ""
echo "Natijalar saqlandi: qa_results.txt"
echo "QA testing tugadi: $(date)"
