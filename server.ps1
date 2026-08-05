# PowerShell Local Web Server using .NET HttpListener
$port = 8080
$workspace = Get-Item "."
$rootPath = $workspace.FullName

# Check if port is in use and find an available one
function Find-AvailablePort($startPort) {
    $port = $startPort
    while ($true) {
        $connection = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
        if ($connection.Port -contains $port) {
            $port++
        } else {
            return $port
        }
    }
}

$port = Find-AvailablePort $port
$url = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "=============================================="
    Write-Host "FutureBridge Local Web Server started!"
    Write-Host "URL: $url"
    Write-Host "Root Directory: $rootPath"
    Write-Host "Press Ctrl+C in this console to stop the server."
    Write-Host "=============================================="

    # Open the browser
    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or $localPath -eq "") {
            $localPath = "/index.html"
        }
        
        # Clean the local path to prevent directory traversal
        $cleanPath = $localPath.Replace("/", "\").TrimStart("\")
        $filePath = Join-Path $rootPath $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            
            switch ($extension) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".htm"  { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".gif"  { $contentType = "image/gif" }
                ".svg"  { $contentType = "image/svg+xml; charset=utf-8" }
                ".webp" { $contentType = "image/webp" }
                ".ico"  { $contentType = "image/x-icon" }
            }
            
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $errorMessage = "500 Internal Server Error: $_"
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $notFoundMessage = "404 Not Found: The file $localPath does not exist."
            $nfBytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundMessage)
            $response.OutputStream.Write($nfBytes, 0, $nfBytes.Length)
        }
        
        $response.OutputStream.Close()
    }
} catch {
    Write-Error "Failed to start the server: $_"
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
    }
}
