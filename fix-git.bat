@echo off
echo Fixing git history to remove API key...
echo.

REM Reset the last commit
git reset HEAD~1

REM Add files again (config.js is now in .gitignore)
git add .

REM Commit with the same message
git commit -m "City selection added - API key secured"

REM Force push to overwrite the problematic commit
echo.
echo Ready to push. The API key is now removed from the commit.
echo Run: git push -f origin main
echo.
pause
