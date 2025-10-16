# Update Mobile Menu Structure Script
# This script replaces flat mobile menu structures with organized category structure

$rootPath = "C:\Users\danny\Projects\sickle-cell-support-website"

# Define the old flat mobile menu pattern (flexible regex)
$oldPattern = @"
(?s)<div class="nav-item mobile-nav-item">\s*<a href="[^"]*" class="nav-link" role="menuitem">Home</a>\s*</div>\s*<div class="nav-item mobile-nav-item">\s*<a href="[^"]*" class="nav-link" role="menuitem">.*?</a>\s*</div>\s*(?:<div class="nav-item mobile-nav-item">\s*<a href="[^"]*" class="nav-link" role="menuitem">.*?</a>\s*</div>\s*)*?(?=<div class="nav-item mobile-nav-item mobile-action-item">)
"@

# Define the new organized mobile menu structure template
function Get-NewMobileMenuStructure {
    param([string]$basePath = "")
    
    if ($basePath -ne "") {
        $basePath = $basePath + "/"
    }
    
    return @"
                <div class="nav-item mobile-nav-item">
                    <a href="${basePath}index.html" class="nav-link" role="menuitem">Home</a>
                </div>
                
                <!-- Mobile Main Categories -->
                <div class="nav-item mobile-nav-item mobile-category">
                    <a href="#" class="nav-link mobile-category-toggle" role="menuitem">Support</a>
                    <div class="mobile-submenu">
                        <a href="${basePath}support/about-sickle-cell.html" class="mobile-submenu-link">Living with Sickle Cell</a>
                        <a href="${basePath}support/support-groups.html" class="mobile-submenu-link">Support Groups</a>
                        <a href="${basePath}support/counseling.html" class="mobile-submenu-link">Counseling Services</a>
                        <a href="${basePath}support/resources.html" class="mobile-submenu-link">Resources</a>
                    </div>
                </div>
                
                <div class="nav-item mobile-nav-item mobile-category">
                    <a href="#" class="nav-link mobile-category-toggle" role="menuitem">Information</a>
                    <div class="mobile-submenu">
                        <a href="${basePath}information/what-is-sickle-cell.html" class="mobile-submenu-link">What is Sickle Cell</a>
                        <a href="${basePath}information/types.html" class="mobile-submenu-link">Types of Sickle Cell</a>
                        <a href="${basePath}information/diagnosis-treatment.html" class="mobile-submenu-link">Diagnosis & Treatment</a>
                        <a href="${basePath}information/research.html" class="mobile-submenu-link">Research & Trials</a>
                    </div>
                </div>
                
                <div class="nav-item mobile-nav-item mobile-category">
                    <a href="#" class="nav-link mobile-category-toggle" role="menuitem">Community</a>
                    <div class="mobile-submenu">
                        <a href="${basePath}community/forum.html" class="mobile-submenu-link">Forum</a>
                        <a href="${basePath}community/warrior-stories.html" class="mobile-submenu-link">Warrior Stories</a>
                        <a href="${basePath}community/blog.html" class="mobile-submenu-link">Blog</a>
                        <a href="${basePath}community/events.html" class="mobile-submenu-link">Events</a>
                        <a href="${basePath}community/gallery.html" class="mobile-submenu-link">Gallery</a>
                    </div>
                </div>
                
                <div class="nav-item mobile-nav-item mobile-category">
                    <a href="#" class="nav-link mobile-category-toggle" role="menuitem">Professionals</a>
                    <div class="mobile-submenu">
                        <a href="${basePath}professionals/healthcare-providers.html" class="mobile-submenu-link">Healthcare Providers</a>
                        <a href="${basePath}professionals/researchers.html" class="mobile-submenu-link">Researchers</a>
                        <a href="${basePath}professionals/educators.html" class="mobile-submenu-link">Educators</a>
                    </div>
                </div>
                
                <div class="nav-item mobile-nav-item">
                    <a href="${basePath}pages/about-us.html" class="nav-link" role="menuitem">About Us</a>
                </div>
                
"@
}

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html" -Recurse | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.Name -ne "index.html" 
}

Write-Host "Found $($htmlFiles.Count) HTML files to update (excluding index.html)"

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Determine the relative path for links
    $relativePath = Get-RelativePath -Path $file.DirectoryName -BasePath $rootPath
    
    # Check if this file has the old flat mobile menu structure
    if ($content -match 'mobile-nav-item.*Living with Sickle Cell|mobile-nav-item.*What is Sickle Cell') {
        Write-Host "  - Found old mobile menu structure, updating..."
        
        # Replace the old structure with the new one
        $newMobileMenu = Get-NewMobileMenuStructure -basePath $relativePath
        
        # Find and replace the mobile menu section
        $updatedContent = $content -replace $oldPattern, $newMobileMenu
        
        # Write back to file
        $updatedContent | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        
        Write-Host "  - Updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "  - No old mobile menu found or already updated" -ForegroundColor Yellow
    }
}

function Get-RelativePath {
    param([string]$Path, [string]$BasePath)
    
    $pathParts = $Path.Replace($BasePath, "").Trim('\').Split('\')
    if ($pathParts.Length -eq 1 -and $pathParts[0] -eq "") {
        return ""
    }
    return "../" * $pathParts.Length
}

Write-Host "`nMobile menu update completed!" -ForegroundColor Green