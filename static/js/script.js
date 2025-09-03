// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to current navigation item
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    const menuLength = menuItems.length;
    
    for (let i = 0; i < menuLength; i++) {
        if (menuItems[i].href === currentLocation) {
            menuItems[i].classList.add('active');
            menuItems[i].setAttribute('aria-current', 'page');
        }
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});

// Add hover effect to schedule cells
const scheduleCells = document.querySelectorAll('.schedule-cell');
scheduleCells.forEach(cell => {
    cell.addEventListener('mouseenter', function() {
        const timeSlot = this.parentElement.firstElementChild.textContent.trim();
        const day = this.cellIndex > 0 ? this.closest('table').querySelector('th:nth-child(' + (this.cellIndex + 1) + ')').textContent : '';
        
        // Highlight all cells in the same time slot
        if (timeSlot) {
            const timeCells = document.querySelectorAll(`td:first-child:contains('${timeSlot}')`);
            timeCells.forEach(timeCell => {
                timeCell.closest('tr').classList.add('table-active');
            });
        }
        
        // Highlight all cells in the same day
        if (day) {
            const dayCells = document.querySelectorAll(`th:contains('${day}')`);
            dayCells.forEach(dayCell => {
                const columnIndex = Array.from(dayCell.parentElement.children).indexOf(dayCell) + 1;
                const cellsInColumn = document.querySelectorAll(`td:nth-child(${columnIndex})`);
                cellsInColumn.forEach(cell => {
                    cell.classList.add('table-active');
                });
            });
        }
    });
    
    cell.addEventListener('mouseleave', function() {
        document.querySelectorAll('.table-active').forEach(el => {
            el.classList.remove('table-active');
        });
    });
});

// Add a helper function to check if an element contains specific text
// This is used for the :contains selector which is not natively supported in modern JS
const contains = (selector, text) => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).filter(element => {
        return element.textContent.includes(text);
    });
};

// Override the default querySelector and querySelectorAll to support :contains
const originalQuerySelectorAll = document.querySelectorAll.bind(document);
const originalQuerySelector = document.querySelector.bind(document);

document.querySelectorAll = function(selector) {
    if (selector.includes(':contains(')) {
        const [baseSelector, containsText] = selector.split(/:contains\(["']?(.*?)["']?\)/);
        const elements = originalQuerySelectorAll(baseSelector);
        return Array.from(elements).filter(el => 
            el.textContent.includes(containsText)
        );
    }
    return originalQuerySelectorAll(selector);
};

document.querySelector = function(selector) {
    if (selector.includes(':contains(')) {
        const result = document.querySelectorAll(selector);
        return result[0] || null;
    }
    return originalQuerySelector(selector);
};
