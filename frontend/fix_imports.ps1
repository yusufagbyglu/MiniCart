$paths = @("src\components\admin", "src\app\admin")
$replacements = @{
    '"@/components/' = '"@/src/components/admin/'
    "'@/components/" = "'@/src/components/admin/"
    '"@/context/'    = '"@/src/context/'
    "'@/context/"    = "'@/src/context/"
    '"@/hooks/'      = '"@/src/hooks/'
    "'@/hooks/"      = "'@/src/hooks/"
    '"@/icons'       = '"@/src/icons'
    "'@/icons"       = "'@/src/icons"
    '"@/layout/'     = '"@/src/components/admin/layout/'
    "'@/layout/"     = "'@/src/components/admin/layout/"
}

foreach ($path in $paths) {
    Get-ChildItem -Path $path -Recurse -Include *.ts, *.tsx | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        foreach ($key in $replacements.Keys) {
            $content = $content.Replace($key, $replacements[$key])
        }
        $content | Set-Content $_.FullName -NoNewline
    }
}
