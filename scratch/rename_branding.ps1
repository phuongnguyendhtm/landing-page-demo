$files = Get-ChildItem -Path ".agents\workflows\*.md"
foreach ($f in $files) {
    $content = Get-Content $f.FullName
    $content = $content -replace "Business Growth Marketing", "FreeUp Content Machine"
    $content = $content -replace "100X", "FreeUp"
    Set-Content $f.FullName $content
}
Write-Output "Successfully updated $($files.Count) workflow files."
