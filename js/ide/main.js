document.addEventListener('DOMContentLoaded', () => {
    RyxIDE.fileExplorer.init('file-tree');
    RyxIDE.terminal.init('terminal-output', 'terminal-input');
    RyxIDE.editor.init('editor-container', () => {
        RyxIDE.terminal.log('Editor initialized.');
    });

    const runButton = document.getElementById('run-button');
    runButton.addEventListener('click', () => {
        const code = RyxIDE.editor.getCode();
        RyxIDE.terminal.log('Executing code...');
        RyxIDE.terminal.log('---');
        
        setTimeout(() => {
            try {
                const result = eval(code);
                RyxIDE.terminal.log(result || 'Execution finished, no output.');
            } catch (error) {
                RyxIDE.terminal.log(`Error: ${error.message}`);
            }
            RyxIDE.terminal.log('---');
        }, 500);
    });
});