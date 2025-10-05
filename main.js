document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    const siteFooter = document.querySelector('.site-footer');

    const toggleMenu = () => {
        hamburgerBtn.classList.toggle('active');
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    // --- Event Listeners ---
    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // --- Build Menu from JSON ---
    const buildMenu = async () => {
        try {
            const response = await fetch('menu.json');
            const data = await response.json();

            const menuList = document.createElement('ul');

            // Create section containers
            const sections = {};
            data.sections.forEach(section => {
                const sectionLi = document.createElement('li');
                sectionLi.className = 'nav-section';
                sectionLi.innerHTML = `<a class="section-title">${section.name}</a>`;
                
                const dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'dropdown-content';
                sectionLi.appendChild(dropdownDiv);

                sections[section.name] = sectionLi;
            });

            // Populate sections and top-level links
            data.pages.forEach(page => {
                const link = document.createElement('a');
                link.href = page.url;
                link.textContent = page.name;

                if (page.section && sections[page.section]) {
                    sections[page.section].querySelector('.dropdown-content').appendChild(link);
                } else {
                    const li = document.createElement('li');
                    li.appendChild(link);
                    menuList.appendChild(li);
                }
            });

            // Add created sections to the main menu list
            Object.values(sections).forEach(section => menuList.appendChild(section));

            sideMenu.appendChild(menuList);
            
            // Add click listener for dropdowns
            document.querySelectorAll('.section-title').forEach(title => {
                title.addEventListener('click', () => {
                    title.parentElement.classList.toggle('open');
                });
            });

        } catch (error) {
            console.error('Failed to load menu:', error);
            sideMenu.innerHTML = '<p style="padding: 15px; color: #ff6b6b;">Error loading menu.</p>';
        }
    };

    // --- Build Footer from JSON ---
    const buildFooter = async () => {
        try {
            const response = await fetch('footer.json');
            const data = await response.json();
            siteFooter.innerHTML = data.content;
        } catch (error) {
            console.error('Failed to load footer:', error);
            siteFooter.innerHTML = '<p>©2025 Rhalza</p>';
        }
    };

    // --- Initialize ---
    buildMenu();
    buildFooter();
});```

---

### `menu.json`

This file structures the navigation menu. Items with a `section` key will be placed inside the corresponding dropdown. Items without a `section` key will be top-level links.

```json
{
    "sections": [
        { "name": "Services" },
        { "name": "About Us" }
    ],
    "pages": [
        {
            "name": "Web Development",
            "url": "#web-dev",
            "section": "Services"
        },
        {
            "name": "Cloud Solutions",
            "url": "#cloud",
            "section": "Services"
        },
        {
            "name": "Our Mission",
            "url": "#mission",
            "section": "About Us"
        },
        {
            "name": "The Team",
            "url": "#team",
            "section": "About Us"
        },
        {
            "name": "Portfolio",
            "url": "#portfolio"
        },
        {
            "name": "Contact",
            "url": "#contact"
        }
    ]
}