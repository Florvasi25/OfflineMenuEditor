function showToolTip(element, message) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip); // Append the tooltip to the body
    }
    
    tooltip.textContent = message;

    // Initially show the tooltip
    const rect = element.getBoundingClientRect();

    tooltip.style.left = `${rect.left}px`; // Position left aligned with the element
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`; // Position below the element
    tooltip.style.display = 'block';

    // Hide the tooltip on mouseout
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    const tooltipTimer = setTimeout(() => {
        tooltip.style.display = 'none';
    }, 2000);

    // Clear the timeout if the user hovers over the tooltip before it disappears
    element.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimer);
    });
}



function removeToolTip(element) {
    const tooltip = element.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove(); // Remove the tooltip element from the DOM
    }
}

function showToolTipMoM(element) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip); // Append the tooltip to the body
    }
    
    tooltip.textContent = 'The MenuItemOptionSetId does not exist in this menu';

    // Initially show the tooltip
    const rect = element.getBoundingClientRect();

    tooltip.style.left = `${rect.right + window.scrollX + 5}px`; // Position to the right of the element
    tooltip.style.top = `${rect.top + window.scrollY}px`; // Maintain the same vertical position
    tooltip.style.display = 'block';
}

export { 
    showToolTip,
    removeToolTip,
    showToolTipMoM
}