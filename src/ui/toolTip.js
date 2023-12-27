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
}

function removeToolTip(element) {
    const tooltip = element.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove(); // Remove the tooltip element from the DOM
    }
}

export { 
    showToolTip,
    removeToolTip
}