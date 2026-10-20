[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$StoreFile,

    [ValidatePattern('^[A-Za-z0-9_.-]+$')]
    [string]$KeyAlias = 'history-upload',

    [string]$OutputFile = $(
        Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'NuntteoboniHistory\release-signing\upload-key.dpapi.json'
    ),

    [switch]$SeparateKeyPassword,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security -ErrorAction Stop
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$resolvedStoreFile = (Resolve-Path -LiteralPath $StoreFile).Path
$resolvedOutputFile = [IO.Path]::GetFullPath($OutputFile)
$projectPrefix = $projectRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar

if ($resolvedStoreFile.Equals($projectRoot, [StringComparison]::OrdinalIgnoreCase) -or
    $resolvedStoreFile.StartsWith($projectPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'The upload keystore must be stored outside the Git repository.'
}
if ($resolvedOutputFile.Equals($projectRoot, [StringComparison]::OrdinalIgnoreCase) -or
    $resolvedOutputFile.StartsWith($projectPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'The DPAPI signing configuration must be stored outside the Git repository.'
}
if ((Test-Path -LiteralPath $resolvedOutputFile) -and -not $Force) {
    throw "Signing configuration already exists. Use -Force only when intentionally replacing it: $resolvedOutputFile"
}

function Protect-DpapiSecureString([Security.SecureString]$secureValue) {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToGlobalAllocUnicode($secureValue)
    [byte[]]$clearBytes = New-Object byte[] ($secureValue.Length * 2)
    try {
        [Runtime.InteropServices.Marshal]::Copy($pointer, $clearBytes, 0, $clearBytes.Length)
        [byte[]]$protectedBytes = [System.Security.Cryptography.ProtectedData]::Protect(
            $clearBytes,
            $null,
            [System.Security.Cryptography.DataProtectionScope]::CurrentUser
        )
        try {
            -join ($protectedBytes | ForEach-Object { $_.ToString('x2') })
        } finally {
            [Array]::Clear($protectedBytes, 0, $protectedBytes.Length)
        }
    } finally {
        [Array]::Clear($clearBytes, 0, $clearBytes.Length)
        [Runtime.InteropServices.Marshal]::ZeroFreeGlobalAllocUnicode($pointer)
    }
}

$storePassword = $null
$keyPassword = $null
try {
    Write-Host 'Enter the upload keystore password. Input is hidden and is not written to shell history.'
    $storePassword = Read-Host -AsSecureString
    if ($SeparateKeyPassword) {
        Write-Host 'Enter the upload key password. Input is hidden and is not written to shell history.'
        $keyPassword = Read-Host -AsSecureString
    } else {
        $keyPassword = $storePassword.Copy()
    }

    $outputDirectory = Split-Path -Parent $resolvedOutputFile
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
    $userSid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
    $directoryAclArgs = @(
        $outputDirectory,
        '/inheritance:r',
        '/grant:r',
        "*${userSid}:(OI)(CI)(F)",
        '*S-1-5-18:(OI)(CI)(F)',
        '*S-1-5-32-544:(OI)(CI)(F)',
        '/C',
        '/Q'
    )
    & icacls.exe @directoryAclArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Could not restrict the signing configuration directory ACL: $outputDirectory"
    }

    $payload = [ordered]@{
        schemaVersion = 1
        applicationId = 'com.nuntteoboni.history'
        storeFile = $resolvedStoreFile
        keyAlias = $KeyAlias
        storePasswordDpapi = Protect-DpapiSecureString $storePassword
        keyPasswordDpapi = Protect-DpapiSecureString $keyPassword
    }
    $payload | ConvertTo-Json | Set-Content -LiteralPath $resolvedOutputFile -Encoding UTF8

    $fileAclArgs = @(
        $resolvedOutputFile,
        '/inheritance:r',
        '/grant:r',
        "*${userSid}:(F)",
        '*S-1-5-18:(F)',
        '*S-1-5-32-544:(F)',
        '/C',
        '/Q'
    )
    & icacls.exe @fileAclArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Could not restrict the signing configuration file ACL: $resolvedOutputFile"
    }

    Write-Host "Created Windows DPAPI-protected release signing configuration: $resolvedOutputFile"
    Write-Host 'The password was not printed or saved as plaintext.'
} finally {
    if ($storePassword) {
        $storePassword.Dispose()
    }
    if ($keyPassword) {
        $keyPassword.Dispose()
    }
}
