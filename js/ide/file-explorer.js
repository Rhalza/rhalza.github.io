var RyxIDE = RyxIDE || {};
RyxIDE.fileExplorer = (function() {
    const fileStructure = [
        { name: 'main.py', type: 'file' },
        { name: 'utils', type: 'folder', children: [
            { name: 'helpers.py', type: 'file' },
            { name: 'visualizer.py', type: 'file' }
        ]},
        { name: 'README.md', type: 'file' }
    ];

    function createTree(files) {
        const ul = document.createElement('ul');
        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name;
            li.classList.add(file.type);
            if (file.type === 'folder' && file.children) {
                li.appendChild(createTree(file.children));
            }
            ul.appendChild(li);
        });
        return ul;
    }

    function init(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(createTree(fileStructure));
        } else {
            console.error(`File explorer container with id "${containerId}" not found.`);
        }
    }

    return {
        init
    };
})();