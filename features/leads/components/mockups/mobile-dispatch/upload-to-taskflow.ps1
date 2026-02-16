$apiKey = "0381c110-3b81-4d19-8f25-7e74c5d3e9bc"
$baseUrl = "https://task-system-nine.vercel.app/api/v1/resources"
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$mockups = @(
    @{ file = "index.html"; name = "Mobile Dispatch - Index"; desc = "Navigation hub for all mobile dispatch mockups" },
    @{ file = "job-cards.html"; name = "Mobile Dispatch - Job Cards"; desc = "Swipeable job cards with priority badges and quick actions" },
    @{ file = "technician-view.html"; name = "Mobile Dispatch - Technician View"; desc = "Team overview with expandable job lists per technician" },
    @{ file = "job-detail.html"; name = "Mobile Dispatch - Job Detail"; desc = "Full job details with status tracker, addresses, and crew" },
    @{ file = "inventory.html"; name = "Mobile Dispatch - Inventory"; desc = "Room-by-room checklist with progress tracking" },
    @{ file = "complete-job.html"; name = "Mobile Dispatch - Complete Job"; desc = "Signature capture, time summary, and tip entry" },
    @{ file = "prototype.html"; name = "Mobile Dispatch - Interactive Prototype"; desc = "All screens combined with clickable navigation" }
)

foreach ($mockup in $mockups) {
    Write-Host "Uploading $($mockup.file)..." -ForegroundColor Cyan

    $content = Get-Content -Path $mockup.file -Raw
    $body = @{
        name = $mockup.name
        description = $mockup.desc
        type = "html"
        content = $content
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body $body
        Write-Host "  SUCCESS: $($response.data.id)" -ForegroundColor Green
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nAll uploads complete!" -ForegroundColor Yellow
