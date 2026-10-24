[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 2100000000)]
    [int]$VersionCode,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$VersionName,

    [string]$SecretFile = $(
        if ($env:HISTORY_RELEASE_SECRET_FILE) {
            $env:HISTORY_RELEASE_SECRET_FILE
        } else {
            Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'NuntteoboniHistory\release-signing\upload-key.dpapi.json'
        }
    )
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security -ErrorAction Stop
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$pythonSetByScript = $false
$releaseEnvironmentNames = @(
    'HISTORY_RELEASE_STORE_FILE',
    'HISTORY_RELEASE_STORE_PASSWORD',
    'HISTORY_RELEASE_KEY_ALIAS',
    'HISTORY_RELEASE_KEY_PASSWORD',
    'HISTORY_ANDROID_VERSION_CODE',
    'HISTORY_ANDROID_VERSION_NAME'
)
$releaseEnvironmentSnapshot = @{}
foreach ($name in $releaseEnvironmentNames) {
    $existing = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
    $releaseEnvironmentSnapshot[$name] = @{
        Exists = $null -ne $existing
        Value = if ($null -ne $existing) { $existing.Value } else { $null }
    }
}

function Clear-ReleaseEnvironment {
    foreach ($name in $releaseEnvironmentNames) {
        Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
    }
}

function Restore-ReleaseEnvironment {
    foreach ($name in $releaseEnvironmentNames) {
        $saved = $releaseEnvironmentSnapshot[$name]
        if ($saved.Exists) {
            Set-Item -LiteralPath "Env:$name" -Value $saved.Value
        } else {
            Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
        }
    }
}

if (-not $env:PYTHON) {
    $pythonCandidates = @(
        (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'),
        ((Get-Command python3.exe -ErrorAction SilentlyContinue).Source),
        ((Get-Command python.exe -ErrorAction SilentlyContinue).Source)
    ) | Where-Object { $_ -and (Test-Path -LiteralPath $_ -PathType Leaf) }
    if ($pythonCandidates.Count -eq 0) {
        throw 'Python 3 was not found. Set PYTHON to a Python 3 executable before building.'
    }
    $env:PYTHON = $pythonCandidates[0]
    $pythonSetByScript = $true
}

if (-not (Test-Path -LiteralPath $SecretFile -PathType Leaf)) {
    throw "Release signing secret file was not found: $SecretFile"
}

$signing = Get-Content -LiteralPath $SecretFile -Raw -Encoding UTF8 | ConvertFrom-Json
if ($signing.schemaVersion -ne 1) {
    throw "Unsupported release signing secret schema: $($signing.schemaVersion)"
}
if ($signing.applicationId -ne 'korea.history_app') {
    throw "Release signing secret belongs to a different applicationId: $($signing.applicationId)"
}
if (-not (Test-Path -LiteralPath $signing.storeFile -PathType Leaf)) {
    throw "Upload keystore was not found: $($signing.storeFile)"
}

function Unprotect-DpapiString([string]$encryptedValue) {
    if ($encryptedValue -notmatch '^[0-9a-fA-F]+$' -or $encryptedValue.Length % 2 -ne 0) {
        throw 'The DPAPI value is not valid hexadecimal data.'
    }
    [byte[]]$protectedBytes = for ($index = 0; $index -lt $encryptedValue.Length; $index += 2) {
        [Convert]::ToByte($encryptedValue.Substring($index, 2), 16)
    }
    [byte[]]$clearBytes = [System.Security.Cryptography.ProtectedData]::Unprotect(
        $protectedBytes,
        $null,
        [System.Security.Cryptography.DataProtectionScope]::CurrentUser
    )
    try {
        [Text.Encoding]::Unicode.GetString($clearBytes)
    } finally {
        [Array]::Clear($clearBytes, 0, $clearBytes.Length)
        [Array]::Clear($protectedBytes, 0, $protectedBytes.Length)
    }
}

Push-Location $projectRoot
try {
    Clear-ReleaseEnvironment
    Write-Host 'Preparing and synchronizing the Android web bundle without loading signing secrets...'
    & npm.cmd run android:sync
    if ($LASTEXITCODE -ne 0) {
        throw "Android sync failed with exit code $LASTEXITCODE"
    }

    $storePassword = Unprotect-DpapiString $signing.storePasswordDpapi
    $keyPassword = Unprotect-DpapiString $signing.keyPasswordDpapi
    $env:HISTORY_RELEASE_STORE_FILE = $signing.storeFile
    $env:HISTORY_RELEASE_STORE_PASSWORD = $storePassword
    $env:HISTORY_RELEASE_KEY_ALIAS = $signing.keyAlias
    $env:HISTORY_RELEASE_KEY_PASSWORD = $keyPassword
    $env:HISTORY_ANDROID_VERSION_CODE = $VersionCode.ToString()
    $env:HISTORY_ANDROID_VERSION_NAME = $VersionName

    Write-Host "Building signed release AAB for $($signing.applicationId), versionCode $VersionCode, versionName $VersionName..."
    & node.exe scripts/run-android-gradle.cjs bundleRelease --no-daemon --no-configuration-cache
    if ($LASTEXITCODE -ne 0) {
        throw "Signed release bundle build failed with exit code $LASTEXITCODE"
    }
} finally {
    Restore-ReleaseEnvironment
    if ($pythonSetByScript) {
        Remove-Item Env:PYTHON -ErrorAction SilentlyContinue
    }
    $storePassword = $null
    $keyPassword = $null
    Pop-Location
}
