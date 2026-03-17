# Element Testing Status Report Generator
# Reads element-testing-tracker.json and displays current test status

param(
    [switch]$Detailed,
    [switch]$OnlyFailed,
    [string]$Category
)

$trackerPath = Join-Path $PSScriptRoot "element-testing-tracker.json"

if (-not (Test-Path $trackerPath)) {
    Write-Host "Error: element-testing-tracker.json not found" -ForegroundColor Red
    exit 1
}

$tracker = Get-Content $trackerPath -Raw | ConvertFrom-Json

# Status emoji mapping
$statusEmoji = @{
    'not-tested' = '⬜'
    'in-progress' = '🟡'
    'passed' = '✅'
    'failed' = '❌'
    'retest' = '🔄'
}

# Calculate summary statistics
$totalElements = 0
$testedElements = 0
$passedElements = 0
$failedElements = 0

foreach ($cat in $tracker.categories.PSObject.Properties) {
    $categoryData = $cat.Value
    foreach ($element in $categoryData.elements) {
        $totalElements++
        if ($element.status -eq 'passed') {
            $passedElements++
            $testedElements++
        } elseif ($element.status -eq 'failed' -or $element.status -eq 'retest') {
            $failedElements++
            $testedElements++
        } elseif ($element.status -eq 'in-progress') {
            $testedElements++
        }
    }
}

$passRate = if ($testedElements -gt 0) { 
    [math]::Round(($passedElements / $testedElements) * 100, 1) 
} else { 
    0 
}

# Display header
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  ELEMENT TESTING STATUS REPORT" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Display summary
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Total Elements: $totalElements"
$testedPercent = [math]::Round(($testedElements/$totalElements)*100,1)
Write-Host "  Tested: $testedElements / $totalElements ($testedPercent%)"
Write-Host "  Passed: $passedElements" -ForegroundColor Green
Write-Host "  Failed: $failedElements" -ForegroundColor Red
Write-Host "  Not Tested: $($totalElements - $testedElements)" -ForegroundColor Gray
if ($testedElements -gt 0) {
    $color = if ($passRate -ge 90) { 'Green' } elseif ($passRate -ge 70) { 'Yellow' } else { 'Red' }
    Write-Host "  Pass Rate: $passRate%" -ForegroundColor $color
}
Write-Host ""

# Display by category
foreach ($cat in $tracker.categories.PSObject.Properties) {
    $categoryName = $cat.Value.name
    $categoryElements = $cat.Value.elements
    
    # Skip if filtering by category and this isn't it
    if ($Category -and $cat.Name -ne $Category) {
        continue
    }
    
    # Count category stats
    $catTotal = $categoryElements.Count
    $catPassed = ($categoryElements | Where-Object { $_.status -eq 'passed' }).Count
    $catFailed = ($categoryElements | Where-Object { $_.status -eq 'failed' -or $_.status -eq 'retest' }).Count
    $catNotTested = ($categoryElements | Where-Object { $_.status -eq 'not-tested' }).Count
    
    Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  $categoryName - $catPassed of $catTotal passed" -ForegroundColor White
    Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
    
    foreach ($element in $categoryElements) {
        # Skip if only showing failed and this passed
        if ($OnlyFailed -and $element.status -ne 'failed' -and $element.status -ne 'retest') {
            continue
        }
        
        $emoji = $statusEmoji[$element.status]
        $name = $element.name.PadRight(20)
        
        if ($Detailed) {
            Write-Host "  $emoji $name" -NoNewline
            $renderMark = if($element.renderTest){'Y'}else{'N'}
            $propsMark = if($element.propsTest){'Y'}else{'N'}
            $editMark = if($element.editMode){'Y'}else{'N'}
            $viewMark = if($element.viewMode){'Y'}else{'N'}
            Write-Host " [Render:$renderMark] [Props:$propsMark] [Edit:$editMark] [View:$viewMark]" -NoNewline
            
            if ($element.hasExternalEditor) {
                $extMark = if($element.externalEditorTest){'Y'}else{'N'}
                Write-Host " [Editor:$extMark]" -NoNewline
            }
            
            if ($element.issues.Count -gt 0) {
                Write-Host " - $($element.issues.Count) issues" -ForegroundColor Red
            } else {
                Write-Host ""
            }
            
            if ($element.notes) {
                Write-Host "     Note: $($element.notes)" -ForegroundColor DarkGray
            }
        } else {
            $statusColor = switch ($element.status) {
                'passed' { 'Green' }
                'failed' { 'Red' }
                'in-progress' { 'Yellow' }
                'retest' { 'Cyan' }
                default { 'Gray' }
            }
            
            Write-Host "  $emoji $name" -NoNewline -ForegroundColor $statusColor
            
            if ($element.hasExternalEditor) {
                Write-Host " (has editor)" -ForegroundColor DarkGray
            } else {
                Write-Host ""
            }
        }
    }
    Write-Host ""
}

# Display external editors summary
Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  External Editors - 10 total" -ForegroundColor White
Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray

$editorsPassed = ($tracker.externalEditors | Where-Object { $_.status -eq 'passed' }).Count
$editorsFailed = ($tracker.externalEditors | Where-Object { $_.status -eq 'failed' }).Count
$editorsNotTested = ($tracker.externalEditors | Where-Object { $_.status -eq 'not-tested' }).Count

Write-Host "  Passed: $editorsPassed" -ForegroundColor Green
Write-Host "  Failed: $editorsFailed" -ForegroundColor Red
Write-Host "  Not Tested: $editorsNotTested" -ForegroundColor Gray
Write-Host ""

# Display bugs summary if any exist
$totalBugs = $tracker.bugs.critical.Count + $tracker.bugs.medium.Count + $tracker.bugs.low.Count
if ($totalBugs -gt 0) {
    Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  Bugs Found" -ForegroundColor Red
    Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  Critical: $($tracker.bugs.critical.Count)" -ForegroundColor Red
    Write-Host "  Medium: $($tracker.bugs.medium.Count)" -ForegroundColor Yellow
    Write-Host "  Low: $($tracker.bugs.low.Count)" -ForegroundColor Gray
    Write-Host ""
}

# Display integration tests summary
Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Integration Tests" -ForegroundColor White
Write-Host "-------------------------------------------------------" -ForegroundColor DarkGray

foreach ($test in $tracker.integrationTests.PSObject.Properties) {
    $testData = $test.Value
    $emoji = $statusEmoji[$testData.status]
    # Convert camelCase to Title Case
    $name = $test.Name -creplace '([A-Z])', ' $1'
    $name = (Get-Culture).TextInfo.ToTitleCase($name.Trim())
    Write-Host "  $emoji $name"
}
Write-Host ""

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Usage examples
if ($args -contains '-?' -or $args -contains '--help') {
    Write-Host "Usage Examples:" -ForegroundColor Yellow
    Write-Host "  .\test-status.ps1                    # Basic overview"
    Write-Host "  .\test-status.ps1 -Detailed          # Show all test details"
    Write-Host "  .\test-status.ps1 -OnlyFailed        # Show only failed elements"
    Write-Host "  .\test-status.ps1 -Category content  # Show only content category"
    Write-Host ""
}
