var RyxIDE = RyxIDE || {};
document.addEventListener('DOMContentLoaded', () => {
    RyxIDE.ui.init();
    RyxIDE.fileExplorer.init('file-tree');
    RyxIDE.terminal.init('terminal-output', 'terminal-input');
    RyxIDE.editor.init('editor-container', () => {
        RyxIDE.terminal.log('Editor initialized. Ready.');
    });

    const runButton = document.querySelector('.action-item[data-view-id="run-panel"]');
    runButton.addEventListener('click', () => {
        const code = RyxIDE.editor.getCode();
        const outputPanel = document.getElementById('output-panel');
        const terminalLogger = RyxIDE.terminal.log;

        terminalLogger('Executing code...');
        outputPanel.textContent = ''; 
        
        try {
            const result = new Function(code)();
            const output = result !== undefined ? result : 'Execution finished, no return value.';
            outputPanel.textContent += output + '\n';
            terminalLogger(`Code executed. See OUTPUT panel for details.`);
        } catch (error) {
            outputPanel.textContent += `Error: ${error.stack}\n`;
            terminalLogger(`An error occurred. See OUTPUT panel for details.`);
        }
    });
});