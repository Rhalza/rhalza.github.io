document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    const hamburgerIcon = document.getElementById('hamburger-icon');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-btn');

    hamburgerIcon.addEventListener('click', () => {
        sideMenu.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });

    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const { sections, pages } = data;
            const menuContainer = document.querySelector('#side-menu');
            
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'menu-section';

                const title = document.createElement('h3');
                title.textContent = section.name;
                sectionDiv.appendChild(title);

                const pageList = document.createElement('ul');
                pageList.className = 'menu-pages';
                
                pages.filter(p => p.section === section.id).forEach(page => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = page.url;
                    link.textContent = page.name;
                    listItem.appendChild(link);
                    pageList.appendChild(listItem);
                });

                sectionDiv.appendChild(pageList);
                menuContainer.appendChild(sectionDiv);

                title.addEventListener('click', () => {
                    const isAlreadyOpen = pageList.style.maxHeight;
                    document.querySelectorAll('#side-menu .menu-pages').forEach((el) => el.style.maxHeight = null);
                    if (!isAlreadyOpen) {
                        pageList.style.maxHeight = pageList.scrollHeight + "px";
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching menu.json:', error));

    fetch('footer.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('footer-content').innerHTML = data.content;
        })
        .catch(error => console.error('Error fetching footer.json:', error));
});