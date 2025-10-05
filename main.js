document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fetch and populate the menu
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.createElement('ul');

            // Create dropdowns first
            data.sections.forEach(section => {
                const sectionItem = document.createElement('li');
                sectionItem.classList.add('dropdown');

                const sectionLink = document.createElement('a');
                sectionLink.href = '#';
                sectionLink.textContent = section.name;
                sectionItem.appendChild(sectionLink);

                const dropdownContent = document.createElement('div');
                dropdownContent.classList.add('dropdown-content');
                sectionItem.appendChild(dropdownContent);

                menuContainer.appendChild(sectionItem);
            });

            // Populate dropdowns with pages
            data.pages.forEach(page => {
                const pageLink = document.createElement('a');
                pageLink.href = page.url;
                pageLink.textContent = page.name;

                const targetSection = menuContainer.querySelector(`.dropdown a[href='#']:first-child`);
                const targetDropdown = Array.from(targetSection.parentNode.parentNode.querySelectorAll('.dropdown a')).find(a => a.textContent === page.section);
                if (targetDropdown) {
                    targetDropdown.nextElementSibling.appendChild(pageLink);
                }
            });

            // Add simple links that are not in a section
            const simpleLinks = data.pages.filter(page => !page.section);
            simpleLinks.forEach(link => {
                const listItem = document.createElement('li');
                const pageLink = document.createElement('a');
                pageLink.href = link.url;
                pageLink.textContent = link.name;
                listItem.appendChild(pageLink);
                menuContainer.appendChild(listItem);
            });


            navMenu.appendChild(menuContainer);

            // Add dropdown toggle for mobile
            const dropdowns = document.querySelectorAll('.dropdown > a');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.parentElement.classList.toggle('active');
                    }
                });
            });
        });

    // Fetch and populate the footer
    fetch('footer.json')
        .then(response => response.json())
        .then(data => {
            const footer = document.querySelector('footer');
            footer.innerHTML = data.content;
        });
});
