@echo off
echo Running RAG pipeline commands...

python bot\pipeline\run_rag_pipelines.py text bot\data\text
if %errorlevel% neq 0 (
    echo "Command 1 failed"
    pause
    exit /b %errorlevel%
)

python bot\pipeline\run_rag_pipelines.py csv bot\data\csv
if %errorlevel% neq 0 (
    echo "Command 2 failed"
    pause
    exit /b %errorlevel%
)

python bot\pipeline\run_rag_pipelines.py csv bot\data\njdg
if %errorlevel% neq 0 (
    echo "Command 3 failed"
    pause
    exit /b %errorlevel%
)

python bot\pipeline\run_rag_pipelines.py pdf bot\data\pdfs\normal
if %errorlevel% neq 0 (
    echo "Command 4 failed"
    pause
    exit /b %errorlevel%
)

python bot\pipeline\run_rag_pipelines.py scanned bot\data\pdfs\ocr
if %errorlevel% neq 0 (
    echo "Command 5 failed"
    pause
    exit /b %errorlevel%
)

echo All commands executed successfully.
pause
