$targetDir = "src"

Get-ChildItem -Path $targetDir -Recurse -Include *.ts, *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Simple strategy: 
    # 1. Replace every "@/src/" with a placeholder to "protect" them
    # 2. Replace every remaining "@/" with "@/src/"
    # 3. Replace placeholder back to "@/src/"
    
    $placeholder = "____SRC_PROTECT____"
    $newContent = $content.Replace("@/src/", $placeholder)
    $newContent = $newContent.Replace("@/", "@/src/")
    $newContent = $newContent.Replace($placeholder, "@/src/")
    
    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($_.FullName, $newContent)
    }
}
