function createItemDropdown(itemRow){
    const itemDropdownCell = document.createElement('td')
    itemDropdownCell.classList.add('itemDropdownCell')

    const boxDropdownButton = createItemDropdownButton(itemRow)
    itemDropdownCell.appendChild(boxDropdownButton)

    return itemDropdownCell
}

function createItemDropdownButton(itemRow){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="sectionDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleItemState(itemRow);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleItemState(itemRow) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (itemRow.classList.contains(expandedClassName)) {
        itemRow.classList.remove(expandedClassName);
        itemRow.classList.add(foldedClassName);

        const OsContainer = itemRow.nextElementSibling;
        if (OsContainer && OsContainer.classList.contains('OsContainer')) {
            OsContainer.classList.add('itemRow');
            OsContainer.remove(); // Remove the content container
        }
    } else {
        itemRow.classList.remove(foldedClassName);
        itemRow.classList.add(expandedClassName);

        let OsContainer = itemRow.nextElementSibling;
        if (!OsContainer || !OsContainer.classList.contains('OsContainer')) {
            // Create a content container and add the content
            OsContainer = document.createElement('table');
            OsContainer.classList.add('OsContainer');
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = 'Hola';
            OsContainer.appendChild(contentParagraph);
            itemRow.parentNode.insertBefore(OsContainer, itemRow.nextSibling);
        } else {
            OsContainer.classList.remove('OsContainer');
        }
    }
}

export {
    createItemDropdown,
}