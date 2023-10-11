function showToolTip(element, message) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        element.appendChild(tooltip);
    }
    
    tooltip.textContent = message;

    // Initially show the tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = rect.bottom + window.scrollY + 'px';
    tooltip.style.display = 'block';

    // Show the tooltip on mouseover
    element.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
    });
    
    // Hide the tooltip on mouseout
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

export {
    showToolTip,
}