var RyxIDE = RyxIDE || {};
RyxIDE.ui = (function() {

    function init() {
        setupPanelTabs();
        setupActivityBar();
    }

    function setupPanelTabs() {
        const tabs = document.querySelectorAll('#panel-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const panelId = tab.getAttribute('data-panel-id');
                
                document.querySelectorAll('#panel-tabs .tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                document.querySelectorAll('#panel-content .panel').forEach(p => p.classList.remove('active'));
                document.getElementById(panelId).classList.add('active');
            });
        });
    }

    function setupActivityBar() {
        const actionItems = document.querySelectorAll('#activity-bar .action-item');
        actionItems.forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('#activity-bar .action-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    function updateStatusBar(rightText) {
        const statusBarRight = document.querySelector('#status-bar .status-right');
        if (statusBarRight) {
            statusBarRight.textContent = rightText;
        }
    }

    return { init, updateStatusBar };
})();