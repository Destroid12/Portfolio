$folders = @("scripting", "vfx")
$projectData = @{
    scripting = @()
    vfx = @()
}

$regex = "^(.*?)\s*\((.*?)\)\.(mp4|png|jpg|jpeg|gif)$"

foreach ($folder in $folders) {
    $path = "assets\$folder"
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -File
        foreach ($file in $files) {
            if ($file.Name -match $regex) {
                $title = $matches[1].Trim()
                $description = $matches[2].Trim()
                $ext = $matches[3].ToLower()
                
                $type = "image"
                if ($ext -eq "mp4") {
                    $type = "video"
                }

                $project = @{
                    title = $title
                    description = $description
                    type = $type
                    url = "assets/$folder/$($file.Name)"
                }
                $projectData[$folder] += $project
            } else {
                Write-Host "Warning: File '$($file.Name)' in $folder does not match the format 'Title (Description).ext'." -ForegroundColor Yellow
            }
        }
    }
}

$json = $projectData | ConvertTo-Json -Depth 3 -Compress
$jsContent = "const projectData = $json;"

Set-Content -Path "projects.js" -Value $jsContent -Encoding UTF8
Write-Host "projects.js successfully updated!" -ForegroundColor Green
