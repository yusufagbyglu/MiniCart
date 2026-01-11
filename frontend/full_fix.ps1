$paths = @("src\components\admin", "src\app\admin")
$replacements = @{
    'from\s+["''](\.\.\/)+icons["'']' = 'from "@/src/icons"'
    'from\s+["''](\.\.\/)+context\/(.*?)["'']' = 'from "@/src/context/$2"'
    'from\s+["''](\.\.\/)+hooks\/(.*?)["'']' = 'from "@/src/hooks/$2"'
    'from\s+["''](\.\.\/)+layout\/(.*?)["'']' = 'from "@/src/components/admin/layout/$2"'
    'from\s+["'']@\/components\/(.*?)["'']' = 'from "@/src/components/admin/$1"'
    'from\s+["'']@\/hooks\/(.*?)["'']' = 'from "@/src/hooks/$1"'
    'from\s+["'']@\/icons["'']' = 'from "@/src/icons"'
    'from\s+["'']@\/context\/(.*?)["'']' = 'from "@/src/context/$1"'
    'from\s+["'']@\/layout\/(.*?)["'']' = 'from "@/src/components/admin/layout/$1"'
}

foreach ($path in $paths) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse -Include *.ts, *.tsx | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            foreach ($pattern in $replacements.Keys) {
                $content = [regex]::Replace($content, $pattern, $replacements[$pattern])
            }
            $content | Set-Content $_.FullName -NoNewline
        }
    }
}
