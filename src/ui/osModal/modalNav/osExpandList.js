function osExpandListButton(osBtnsCell) {
    const expandButtonContainer = document.createElement('div')
    expandButtonContainer.className = 'expandButtonContainer'

    const expandListButton = document.createElement('button');
    expandListButton.classList.add('sectionButton')
    expandListButton.classList.add('expandListButton')
    const expandListButtonImg = document.createElement('img')
    expandListButtonImg.classList.add('expandListButtonImg')
    expandListButtonImg.src = '../../assets/expandIcon.svg'
    expandListButton.appendChild(expandListButtonImg)

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');
    dropdownContent.id = 'myDropdown';
    
    const elements = ['Pear', 'Tomatoes', 'Lettuce', 'Love'];
    elements.forEach(element => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = element;
        dropdownContent.appendChild(a);
    });
    
    expandListButton.addEventListener('click', toggleDropdown);
    
    expandButtonContainer.appendChild(expandListButton)
    expandButtonContainer.appendChild(dropdownContent);
    
    osBtnsCell.appendChild(expandButtonContainer);
}

// Toggle dropdown visibility and rotate arrow
function toggleDropdown() {
    const dropdownContent = document.getElementById('myDropdown');
    dropdownContent.classList.toggle('show');

    const expandListButton = document.querySelector('.expandListButton');
    expandListButton.classList.toggle('rotate');
}

// // Create the dropdown on window load
// createDropdown()


export { osExpandListButton }