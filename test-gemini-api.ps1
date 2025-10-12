# Simple Gemini API Test Script
# This tests your Gemini API key directly from PowerShell

$API_KEY = "AIzaSyAnXiZuOwuH22tmB-wJ126P8GGlcHXeIfg"

Write-Host "🧪 Testing Gemini API..." -ForegroundColor Cyan
Write-Host "API Key: $API_KEY" -ForegroundColor Gray
Write-Host ""

# Test 1: Check if API key is valid
Write-Host "Step 1: Testing API key validity..." -ForegroundColor Yellow

try {
    $url = "https://generativelanguage.googleapis.com/v1beta/models?key=$API_KEY"
    Write-Host "Making request to: $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Method GET -ContentType "application/json"
    
    Write-Host "✅ SUCCESS! API key is valid!" -ForegroundColor Green
    Write-Host "Available models: $($response.models.Count)" -ForegroundColor Green
    Write-Host "First few models:" -ForegroundColor Green
    $response.models[0..2] | ForEach-Object { 
        $modelName = $_.name.Split('/')[-1]
        Write-Host "  - $modelName" -ForegroundColor Green
    }
    Write-Host ""
    
    # Test 2: Make a simple AI request
    Write-Host "Step 2: Testing AI generation..." -ForegroundColor Yellow
    
    $requestBody = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "Hello! Please respond with exactly: 'Gemini API is working for WarriorBot!'"
                    }
                )
            }
        )
        generationConfig = @{
            maxOutputTokens = 100
            temperature = 0.1
        }
    } | ConvertTo-Json -Depth 10
    
    # Try the available flash model
    $generateUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=$API_KEY"
    Write-Host "Making AI request to: $generateUrl" -ForegroundColor Gray
    
    $aiResponse = Invoke-RestMethod -Uri $generateUrl -Method POST -Body $requestBody -ContentType "application/json"
    
    if ($aiResponse.candidates -and $aiResponse.candidates[0].content.parts[0].text) {
        $aiText = $aiResponse.candidates[0].content.parts[0].text
        Write-Host "✅ SUCCESS! AI is responding!" -ForegroundColor Green
        Write-Host "AI Response: '$aiText'" -ForegroundColor Green
        Write-Host ""
        
        # Test 3: Test WarriorBot-style request
        Write-Host "Step 3: Testing WarriorBot AI..." -ForegroundColor Yellow
        
        $warriorbotRequest = @{
            contents = @(
                @{
                    parts = @(
                        @{
                            text = "You are WarriorBot, an AI companion for people with sickle cell disease. A user just said 'I need encouragement'. Please respond with an encouraging message for someone with sickle cell disease, including a Bible verse."
                        }
                    )
                }
            )
            generationConfig = @{
                maxOutputTokens = 300
                temperature = 0.7
            }
        } | ConvertTo-Json -Depth 10
        
        $warriorbotResponse = Invoke-RestMethod -Uri $generateUrl -Method POST -Body $warriorbotRequest -ContentType "application/json"
        
        if ($warriorbotResponse.candidates -and $warriorbotResponse.candidates[0].content.parts[0].text) {
            $warriorbotText = $warriorbotResponse.candidates[0].content.parts[0].text
            Write-Host "✅ SUCCESS! WarriorBot AI is working perfectly!" -ForegroundColor Green
            Write-Host ""
            Write-Host "WarriorBot Response:" -ForegroundColor Cyan
            Write-Host "$warriorbotText" -ForegroundColor White
            Write-Host ""
            Write-Host "🎉 ALL TESTS PASSED! Your Gemini API is ready for WarriorBot!" -ForegroundColor Green
        } else {
            Write-Host "❌ WarriorBot test failed - no valid response" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ AI generation test failed - no valid response" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- API key might be invalid or not activated" -ForegroundColor Yellow
    Write-Host "- Network connectivity issues" -ForegroundColor Yellow
    Write-Host "- API quota exceeded" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan