var RyxIDE = RyxIDE || {};
RyxIDE.editor = (function() {
    let editorInstance;

    function init(containerId, callback) {
        if (!window.require) {
            console.error('Monaco Editor loader not found.');
            return;
        }

        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
        
        window.MonacoEnvironment = {
            getWorkerUrl: function (workerId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/'
                };
                importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs/base/worker/workerMain.js');`
                )}`;
            }
        };

        require(['vs/editor/editor.main'], function() {
            const container = document.getElementById(containerId);
            if (!container) {
                 console.error(`Container with id "${containerId}" not found.`);
                 return;
            }

            editorInstance = monaco.editor.create(container, {
                value: [
                    'function greet() {',
                    '\tconst message = "Hello from the RyxIDE!";',
                    '\treturn message;',
                    '}',
                    '',
                    'greet();'
                ].join('\n'),
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true
            });

            if (callback) {
                callback();
            }
        });
    }

    function getCode() {
        return editorInstance ? editorInstance.getValue() : '';
    }

    return {
        init,
        getCode
    };
})();