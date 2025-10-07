var RyxIDE = RyxIDE || {};
RyxIDE.terminal = (function() {
    let outputElement;
    let inputElement;

    function init(outputId, inputId) {
        outputElement = document.getElementById(outputId);
        inputElement = document.getElementById(inputId);

        if (inputElement) {
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    const command = inputElement.value;
                    log(`> ${command}`);
                    handleCommand(command);
                    inputElement.value = '';
                }
            });
        }
        log('RyxIDE Console Initialized.');
    }

    function log(message) {
        if (outputElement) {
            outputElement.textContent += message + '\n';
            outputElement.scrollTop = outputElement.scrollHeight;
        }
    }

    function handleCommand(command) {
        if (command.trim() === 'clear') {
            outputElement.textContent = '';
            log('Console cleared.');
        } else if (command.trim() === 'help') {
            log('Available commands: clear, help, date');
        } else if (command.trim() === 'date') {
            log(new Date().toString());
        } else {
            log(`Command not found: ${command}`);
        }
    }

    return {
        init,
        log
    };
})();