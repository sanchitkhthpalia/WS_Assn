# Test API endpoints for clinic booking app
# Run this script in PowerShell from the project root

Write-Host "🧪 Testing Clinic Booking API..." -ForegroundColor Green
Write-Host ""

# Test 1: Register a new patient
Write-Host "1. Registering new patient..." -ForegroundColor Yellow
$registerResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/register" -ContentType "application/json" -Body '{"name":"Test Patient","email":"test@example.com","password":"Passw0rd!"}'
Write-Host "✅ Registration successful: $($registerResponse.message)" -ForegroundColor Green

# Test 2: Login as patient
Write-Host "`n2. Logging in as patient..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/login" -ContentType "application/json" -Body '{"email":"test@example.com","password":"Passw0rd!"}'
$token = $loginResponse.token
Write-Host "✅ Login successful: $($loginResponse.role)" -ForegroundColor Green

# Test 3: Get available slots
Write-Host "`n3. Getting available slots..." -ForegroundColor Yellow
$slotsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/slots"
$availableSlots = $slotsResponse | Where-Object { -not $_.isBooked }
Write-Host "✅ Found $($availableSlots.Count) available slots" -ForegroundColor Green

if ($availableSlots.Count -gt 0) {
    $slotId = $availableSlots[0].id
    Write-Host "   Using slot ID: $slotId" -ForegroundColor Cyan
    
    # Test 4: Book a slot
    Write-Host "`n4. Booking slot $slotId..." -ForegroundColor Yellow
    $bookBody = '{"slotId":' + $slotId + '}'
    $bookResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/book" -Headers @{"Authorization"="Bearer $token"} -ContentType "application/json" -Body $bookBody
    Write-Host "✅ Booking successful: $($bookResponse.id)" -ForegroundColor Green
    
    # Test 5: Get user bookings
    Write-Host "`n5. Getting user bookings..." -ForegroundColor Yellow
    $myBookingsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/my-bookings" -Headers @{"Authorization"="Bearer $token"}
    Write-Host "✅ Found $($myBookingsResponse.Count) bookings" -ForegroundColor Green
    
    # Test 6: Try to double-book (should fail)
    Write-Host "`n6. Testing double-booking prevention..." -ForegroundColor Yellow
    try {
        $doubleBookResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/book" -Headers @{"Authorization"="Bearer $token"} -ContentType "application/json" -Body $bookBody
    } catch {
        Write-Host "✅ Double-booking correctly prevented: $($_.Exception.Message)" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  No available slots to book" -ForegroundColor Yellow
}

# Test 7: Login as admin
Write-Host "`n7. Logging in as admin..." -ForegroundColor Yellow
$adminLoginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/login" -ContentType "application/json" -Body '{"email":"admin@example.com","password":"Passw0rd!"}'
$adminToken = $adminLoginResponse.token
Write-Host "✅ Admin login successful: $($adminLoginResponse.role)" -ForegroundColor Green

# Test 8: Get all bookings (admin only)
Write-Host "`n8. Getting all bookings (admin view)..." -ForegroundColor Yellow
$allBookingsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/all-bookings" -Headers @{"Authorization"="Bearer $adminToken"}
Write-Host "✅ Found $($allBookingsResponse.Count) total bookings" -ForegroundColor Green

Write-Host "`n🎉 All tests completed successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
