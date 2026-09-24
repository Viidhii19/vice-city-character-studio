# check-submission-deployment-ready.ps1
# Run this from the ROOT of your React/Vite project.
# Usage:
#   Set-ExecutionPolicy -Scope Process Bypass
#   .\check-submission-deployment-ready.ps1
#
# This is an audit script. It does NOT deploy or modify your project.

$ErrorActionPreference = "Continue"

$PASS = 0
$WARN = 0
$FAIL = 0

function Pass($msg) {
    $script:PASS++
    Write-Host "[PASS] $msg" -ForegroundColor Green
}
function Warn($msg) {
    $script:WARN++
    Write-Host "[WARN] $msg" -ForegroundColor Yellow
}
function Fail($msg) {
    $script:FAIL++
    Write-Host "[FAIL] $msg" -ForegroundColor Red
}
function Info($msg) {
    Write-Host "[INFO] $msg" -ForegroundColor Cyan
}
function Section($msg) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Magenta
    Write-Host $msg -ForegroundColor Magenta
    Write-Host "============================================================" -ForegroundColor Magenta
}

Section "VICE CITY CHARACTER STUDIO - SUBMISSION + DEPLOYMENT AUDIT"

Info "Project: $(Get-Location)"
Info "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# ------------------------------------------------------------
# 1. BASIC PROJECT STRUCTURE
# ------------------------------------------------------------
Section "1. PROJECT STRUCTURE"

if (Test-Path "package.json") {
    Pass "package.json exists"
} else {
    Fail "package.json is missing"
    Write-Host ""
    Write-Host "This does not look like a Node/React project." -ForegroundColor Red
    exit 1
}

if (Test-Path "src") {
    Pass "src/ directory exists"
} else {
    Warn "src/ directory not found"
}

if (Test-Path "public") {
    Pass "public/ directory exists"
} else {
    Warn "public/ directory not found"
}

if (Test-Path "README.md") {
    Pass "README.md exists"
} else {
    Fail "README.md is missing"
}

if (Test-Path ".git") {
    Pass "Git repository detected"
} else {
    Fail "Git repository not detected"
}

# ------------------------------------------------------------
# 2. PACKAGE.JSON
# ------------------------------------------------------------
Section "2. PACKAGE.JSON + BUILD SCRIPTS"

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json

if ($pkg.scripts) {
    if ($pkg.scripts.build) {
        Pass "npm build script exists: $($pkg.scripts.build)"
    } else {
        Fail "npm build script is missing"
    }

    if ($pkg.scripts.dev) {
        Pass "npm dev script exists"
    } else {
        Warn "npm dev script is missing"
    }

    if ($pkg.scripts.preview) {
        Pass "npm preview script exists"
    } else {
        Warn "npm preview script is missing"
    }
} else {
    Fail "package.json has no scripts section"
}

# Check Unlayer dependency
$allDeps = @{}
if ($pkg.dependencies) {
    $pkg.dependencies.psobject.Properties | ForEach-Object {
        $allDeps[$_.Name] = $_.Value
    }
}
if ($pkg.devDependencies) {
    $pkg.devDependencies.psobject.Properties | ForEach-Object {
        $allDeps[$_.Name] = $_.Value
    }
}

if ($allDeps.ContainsKey("@unlayer/react-image-editor")) {
    Pass "Unlayer React Image Editor dependency found: $($allDeps['@unlayer/react-image-editor'])"
} else {
    Fail "@unlayer/react-image-editor dependency NOT found"
}

# ------------------------------------------------------------
# 3. NODE / NPM
# ------------------------------------------------------------
Section "3. NODE + NPM"

try {
    $nodeVersion = node --version
    Pass "Node installed: $nodeVersion"
} catch {
    Fail "Node.js is not available"
}

try {
    $npmVersion = npm --version
    Pass "npm installed: $npmVersion"
} catch {
    Fail "npm is not available"
}

# ------------------------------------------------------------
# 4. DEPENDENCIES
# ------------------------------------------------------------
Section "4. DEPENDENCY INSTALLATION"

if (Test-Path "node_modules") {
    Pass "node_modules exists"
} else {
    Warn "node_modules does not exist - run npm install"
}

if (Test-Path "package-lock.json") {
    Pass "package-lock.json exists"
} else {
    Warn "package-lock.json missing"
}

# ------------------------------------------------------------
# 5. BUILD TEST
# ------------------------------------------------------------
Section "5. PRODUCTION BUILD"

Info "Running npm run build..."
npm run build

if ($LASTEXITCODE -eq 0) {
    Pass "Production build completed successfully"
} else {
    Fail "Production build FAILED"
}

if (Test-Path "dist") {
    $distFiles = Get-ChildItem "dist" -Recurse -File -ErrorAction SilentlyContinue
    if ($distFiles.Count -gt 0) {
        Pass "dist/ contains generated production files"
    } else {
        Fail "dist/ exists but contains no files"
    }
} else {
    Warn "dist/ directory not found after build"
}

# ------------------------------------------------------------
# 6. TYPESCRIPT / SOURCE ERRORS
# ------------------------------------------------------------
Section "6. SOURCE CODE QUICK SCAN"

$sourceFiles = Get-ChildItem -Path "." -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx -ErrorAction SilentlyContinue |
    Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\.git\\"
    }

Info "Source files found: $($sourceFiles.Count)"

# Obvious TODO/FIXME markers
$todoMatches = $sourceFiles | Select-String -Pattern "TODO|FIXME|HACK|TEMP" -SimpleMatch:$false -ErrorAction SilentlyContinue
if ($todoMatches) {
    Warn "TODO/FIXME/HACK/TEMP markers found in source"
    $todoMatches | Select-Object -First 15 | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber) $($_.Line.Trim())" -ForegroundColor DarkYellow
    }
} else {
    Pass "No obvious TODO/FIXME/HACK/TEMP markers found"
}

# localhost scan
$localhostMatches = $sourceFiles | Select-String -Pattern "localhost|127\.0\.0\.1" -ErrorAction SilentlyContinue
if ($localhostMatches) {
    Warn "localhost/127.0.0.1 references found - verify they are not required in production"
    $localhostMatches | Select-Object -First 15 | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber) $($_.Line.Trim())" -ForegroundColor DarkYellow
    }
} else {
    Pass "No localhost references found in source"
}

# ------------------------------------------------------------
# 7. SECRET / ENVIRONMENT SCAN
# ------------------------------------------------------------
Section "7. SECRET + ENVIRONMENT AUDIT"

$envFiles = Get-ChildItem -Path "." -Recurse -File -Force -Filter ".env*" -ErrorAction SilentlyContinue |
    Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\.git\\"
    }

if ($envFiles.Count -gt 0) {
    foreach ($file in $envFiles) {
        if ($file.Name -match "\.example$|\.sample$") {
            Pass "Environment template found: $($file.FullName)"
        } else {
            Warn "Environment file found: $($file.FullName) - make sure secrets are NOT committed"
        }
    }
} else {
    Info "No .env files found"
}

# Search for common secret-like strings
$secretPatterns = @(
    "AIza[0-9A-Za-z_-]{20,}",
    "sk-[A-Za-z0-9_-]{20,}",
    "ghp_[A-Za-z0-9]{20,}",
    "github_pat_[A-Za-z0-9_]{20,}",
    "xox[baprs]-[A-Za-z0-9-]{10,}",
    "BEGIN PRIVATE KEY"
)

$secretFound = $false

foreach ($pattern in $secretPatterns) {
    $matches = $sourceFiles | Select-String -Pattern $pattern -ErrorAction SilentlyContinue
    if ($matches) {
        $secretFound = $true
        Fail "Possible secret/token pattern found: $pattern"
        $matches | Select-Object -First 5 | ForEach-Object {
            Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Red
        }
    }
}

if (-not $secretFound) {
    Pass "No obvious API-key/private-key patterns found in source"
}

# ------------------------------------------------------------
# 8. GIT STATUS
# ------------------------------------------------------------
Section "8. GIT + GITHUB READINESS"

if (Test-Path ".gitignore") {
    Pass ".gitignore exists"
} else {
    Fail ".gitignore is missing"
}

$gitStatus = git status --short 2>&1
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Warn "There are uncommitted/untracked Git changes"
        $gitStatus | Select-Object -First 30 | ForEach-Object {
            Write-Host "  $_" -ForegroundColor DarkYellow
        }
    } else {
        Pass "Git working tree is clean"
    }
} else {
    Fail "Unable to read Git status"
}

$remote = git remote -v 2>&1
if ($LASTEXITCODE -eq 0 -and $remote) {
    Pass "Git remote configured"
    $remote | Select-Object -First 4 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
} else {
    Warn "No Git remote detected"
}

# ------------------------------------------------------------
# 9. README CONTENT
# ------------------------------------------------------------
Section "9. README SUBMISSION CHECK"

if (Test-Path "README.md") {
    $readme = Get-Content "README.md" -Raw

    $readmeChecks = @(
        @{ Name="Project description"; Pattern="Vice City|Character|GTA|Unlayer|Image Editor" },
        @{ Name="Features"; Pattern="Features|feature" },
        @{ Name="Installation"; Pattern="Installation|Install|npm install" },
        @{ Name="Run instructions"; Pattern="npm run dev|npm run build|npm run preview" },
        @{ Name="Deployment"; Pattern="Deploy|Deployment|Vercel|Netlify|Cloudflare" },
        @{ Name="Tech stack"; Pattern="Tech Stack|Technologies|React|Vite" },
        @{ Name="GitHub / repository information"; Pattern="GitHub|github.com" }
    )

    foreach ($check in $readmeChecks) {
        if ($readme -match $check.Pattern) {
            Pass "README has: $($check.Name)"
        } else {
            Warn "README may be missing: $($check.Name)"
        }
    }
}

# ------------------------------------------------------------
# 10. REQUIRED CHALLENGE FEATURES - STATIC CHECK
# ------------------------------------------------------------
Section "10. CHALLENGE FEATURE STATIC CHECK"

$allSourceText = ""
foreach ($file in $sourceFiles) {
    try {
        $allSourceText += "`n" + (Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue)
    } catch {}
}

$featureChecks = @(
    @{ Name="React Image Editor integration"; Pattern="react-image-editor|ImageEditor" },
    @{ Name="Image editing flow"; Pattern="editor|image" },
    @{ Name="Vibe system"; Pattern="vibe|Vibe" },
    @{ Name="Activity/lifestyle system"; Pattern="activity|Activity|lifestyle|Lifestyle" },
    @{ Name="Character/profile system"; Pattern="character|Character|profile|Profile" },
    @{ Name="Download/export functionality"; Pattern="download|Download|export|Export|toDataURL|canvas" },
    @{ Name="Upload/image selection"; Pattern="upload|Upload|file" }
)

foreach ($check in $featureChecks) {
    if ($allSourceText -match $check.Pattern) {
        Pass "Found implementation references for: $($check.Name)"
    } else {
        Warn "Could not statically verify: $($check.Name)"
    }
}

# ------------------------------------------------------------
# 11. HTML / APP BASICS
# ------------------------------------------------------------
Section "11. WEB APP BASICS"

if (Test-Path "index.html") {
    Pass "index.html exists"
    $html = Get-Content "index.html" -Raw

    if ($html -match "<title>.*\S.*</title>") {
        Pass "HTML title exists"
    } else {
        Warn "HTML title appears missing/empty"
    }

    if ($html -match "viewport") {
        Pass "Viewport meta tag exists"
    } else {
        Warn "Viewport meta tag not detected"
    }

    if ($html -match "favicon|icon") {
        Pass "Some icon/favicon reference detected"
    } else {
        Warn "Favicon/icon reference not detected"
    }
} else {
    Fail "index.html is missing"
}

# ------------------------------------------------------------
# 12. BUILD ARTIFACT CHECK
# ------------------------------------------------------------
Section "12. DEPLOYMENT ARTIFACT CHECK"

if (Test-Path "dist") {
    $indexDist = Join-Path "dist" "index.html"
    if (Test-Path $indexDist) {
        Pass "dist/index.html exists"
    } else {
        Fail "dist/index.html missing"
    }

    $assets = Get-ChildItem "dist" -Recurse -File -ErrorAction SilentlyContinue
    if ($assets.Count -gt 1) {
        Pass "Production assets generated: $($assets.Count) files"
    } else {
        Warn "Very few production files found"
    }
}

# ------------------------------------------------------------
# 13. COMMON BUILD PROBLEMS
# ------------------------------------------------------------
Section "13. COMMON PROBLEM SCAN"

$problemPatterns = @(
    @{ Label="React TODO placeholder"; Pattern="Coming Soon|Lorem ipsum|TODO: IMPLEMENT|PLACEHOLDER" },
    @{ Label="Debug logging"; Pattern="console\.log\(" },
    @{ Label="Alert debugging"; Pattern="alert\(" }
)

foreach ($p in $problemPatterns) {
    $matches = $sourceFiles | Select-String -Pattern $p.Pattern -ErrorAction SilentlyContinue
    if ($matches) {
        if ($p.Label -eq "Debug logging") {
            Warn "$($p.Label) found in source: $($matches.Count) occurrence(s)"
        } else {
            Warn "$($p.Label) found in source"
        }
        $matches | Select-Object -First 10 | ForEach-Object {
            Write-Host "  $($_.Path):$($_.LineNumber) $($_.Line.Trim())" -ForegroundColor DarkYellow
        }
    } else {
        Pass "No $($p.Label) detected"
    }
}

# ------------------------------------------------------------
# 14. FINAL RESULT
# ------------------------------------------------------------
Section "FINAL AUDIT RESULT"

Write-Host ""
Write-Host "PASS : $PASS" -ForegroundColor Green
Write-Host "WARN : $WARN" -ForegroundColor Yellow
Write-Host "FAIL : $FAIL" -ForegroundColor Red
Write-Host ""

if ($FAIL -eq 0 -and $WARN -eq 0) {
    Write-Host "READY: Static checks are clean." -ForegroundColor Green
} elseif ($FAIL -eq 0) {
    Write-Host "MOSTLY READY: No hard failures, but review all warnings before submission/deployment." -ForegroundColor Yellow
} else {
    Write-Host "NOT READY: Fix all FAIL items before submission/deployment." -ForegroundColor Red
}

Write-Host ""
Write-Host "IMPORTANT: This script cannot verify visual/UX behavior automatically." -ForegroundColor Cyan
Write-Host "Manually test these before submitting:" -ForegroundColor Cyan
Write-Host "  1. Vibe buttons visibly change the UI/card."
Write-Host "  2. Activity selection changes/persists correctly."
Write-Host "  3. Unlayer editor opens and saves correctly."
Write-Host "  4. Text/drawing/stickers can be selected, moved and deleted."
Write-Host "  5. Base photo is never accidentally destroyed by overlay deletion."
Write-Host "  6. Downloaded PNG contains the COMPLETE card with no side cropping."
Write-Host "  7. Refresh does not break the app."
Write-Host "  8. Mobile layout works."
Write-Host "  9. No API keys/secrets are exposed in the browser or GitHub."
Write-Host " 10. Production deployment URL works in an incognito window."
Write-Host " 11. GitHub repository is public and contains the final code."
Write-Host " 12. README explains the project and how to run/deploy it."
Write-Host ""
Write-Host "Challenge deadline: Sep 24, 2026 23:59 UTC / Sep 25, 2026 05:29 IST." -ForegroundColor Cyan
