Write-Host "Undoing the massive commit..."
git reset HEAD~1
git reset

Write-Host "Getting list of untracked files..."
$files = git ls-files --others --exclude-standard

foreach ($file in $files) {
    Write-Host "Adding and pushing: $file"
    git add "$file"
    git commit -m "Uploading asset chunk: $file"
    git push
}

Write-Host "Getting list of modified files..."
$mod_files = git diff --name-only
foreach ($file in $mod_files) {
    Write-Host "Adding and pushing: $file"
    git add "$file"
    git commit -m "Updating: $file"
    git push
}

Write-Host "Done!"
