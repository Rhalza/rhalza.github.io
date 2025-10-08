var RyxIDE = RyxIDE || {};
RyxIDE.editor = (function() {
    let editorInstance;

    function init(containerId, callback) {
        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs' }});
        
        window.MonacoEnvironment = {
            getWorkerUrl: function (workerId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/'
                };
                importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs/base/worker/workerMain.js');`
                )}`;
            }
        };

        require(['vs/editor/editor.main'], function() {
            const container = document.getElementById(containerId);
            editorInstance = monaco.editor.create(container, {
                value: 'console.log("Hello, RyxIDE!");',
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true
            });

            editorInstance.onDidChangeCursorPosition(e => {
                const pos = e.position;
                RyxIDE.ui.updateStatusBar(`Ln ${pos.lineNumber}, Col ${pos.column}`);
            });

            if (callback) callback();
        });
    }

    function getCode() {
        return editorInstance ? editorInstance.getValue() : '';
    }

    return { init, getCode };
})();