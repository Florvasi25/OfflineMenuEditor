function showToolTip(element, message) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        element.appendChild(tooltip);
    }
    
    tooltip.textContent = message;
    
    // Manually set the position based on the buttons coordinates
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = rect.bottom + window.scrollY + 'px';
    
    tooltip.style.display = 'block';
    
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 2000);
}

export {
    showToolTip,
}