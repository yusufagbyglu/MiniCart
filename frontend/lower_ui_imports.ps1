$targetDir = "src"
$uiComponents = @("Badge", "Button", "Card", "Input", "Sheet")

Get-ChildItem -Path $targetDir -Recurse -Include *.ts, *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    foreach ($comp in $uiComponents) {
        # This pattern looks for /ui/ followed by the component name,
        # ensuring it's followed by a quote (ending the import string)
        $pattern = "/ui/$comp(?=['\""])"
        $lowerComp = $comp.ToLower()
        
        if ($content -match $pattern) {
            # Use regex replace to swap the casing
            $content = [regex]::Replace($content, $pattern, "/ui/$lowerComp")
            $modified = $true
        }
    }

    if ($modified) {
        # Force UTF8 without BOM to keep files clean for Next.js
        [System.IO.File]::WriteAllText($_.FullName, $content)
    }
}
