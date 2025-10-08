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

    function getIcon(type) {
        const i = document.createElement('i');
        i.classList.add('fas');
        if (type === 'folder') {
            i.classList.add('fa-folder');
        } else {
            i.classList.add('fa-file-code');
        }
        return i;
    }

    function createTree(files) {
        const ul = document.createElement('ul');
        files.forEach(file => {
            const li = document.createElement('li');
            li.appendChild(getIcon(file.type));
            const span = document.createElement('span');
            span.textContent = file.name;
            li.appendChild(span);

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
        }
    }

    return { init };
})();