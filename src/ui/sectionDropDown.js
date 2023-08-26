function createSectionDropdown(sectionRow){
    const sectionDropdownCell = document.createElement('td')
    sectionDropdownCell.classList.add('sectionDropdownCell')

    const boxDropdownButton = createSectionDropdownButton(sectionRow)
    sectionDropdownCell.appendChild(boxDropdownButton)

    return sectionDropdownCell
}

function createSectionDropdownButton(sectionRow){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="sectionDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleSectionState(sectionRow);
        event.stopPropagation();
    });

    return boxDropdownButton
}

// Function to toggle section state and show/hide content
function toggleSectionState(sectionRow) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (sectionRow.classList.contains(expandedClassName)) {
        sectionRow.classList.remove(expandedClassName);
        sectionRow.classList.add(foldedClassName);

        const ItemsContainer = sectionRow.nextElementSibling;
        if (ItemsContainer && ItemsContainer.classList.contains('ItemsContainer')) {
            ItemsContainer.classList.add('itemContainer');
            ItemsContainer.remove(); // Remove the content container
        }
    } else {
        sectionRow.classList.remove(foldedClassName);
        sectionRow.classList.add(expandedClassName);

        let ItemsContainer = sectionRow.nextElementSibling;
        if (!ItemsContainer || !ItemsContainer.classList.contains('ItemsContainer')) {
            // Create a content container and add the content
            ItemsContainer = document.createElement('div');
            ItemsContainer.classList.add('ItemsContainer');
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = 'Hola';
            ItemsContainer.appendChild(contentParagraph);
            sectionRow.parentNode.insertBefore(ItemsContainer, sectionRow.nextSibling);
        } else {
            ItemsContainer.classList.remove('ItemsContainer');
        }
    }
}

export {
    createSectionDropdown
}