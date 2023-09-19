function createOsDropdown(osRowHeader){
    const osDropdownCell = document.createElement('div')
    osDropdownCell.classList.add('osDropdownCell')

    const boxDropdownButton = createOsDropdownButton(osRowHeader)
    osDropdownCell.appendChild(boxDropdownButton)

    return osDropdownCell
}

function createOsDropdownButton(osRowHeader){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="osDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleItemState(osRowHeader);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleItemState(osRowHeader) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (osRowHeader.classList.contains(expandedClassName)) {
        osRowHeader.classList.remove(expandedClassName);
        osRowHeader.classList.add(foldedClassName);

        const OsContainer = osRowHeader.nextElementSibling;
        if (OsContainer && OsContainer.classList.contains('OsContainer')) {
            OsContainer.classList.add('osRowHeader');
            OsContainer.remove(); // Remove the content container
        }
    } else {
        osRowHeader.classList.remove(foldedClassName);
        osRowHeader.classList.add(expandedClassName);

        let OsContainer = osRowHeader.nextElementSibling;
        if (!OsContainer || !OsContainer.classList.contains('OsContainer')) {
            // Create a content container and add the content
            OsContainer = document.createElement('div');
            OsContainer.classList.add('OsContainer');
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = 'Hola';
            OsContainer.appendChild(contentParagraph);
            osRowHeader.parentNode.insertBefore(OsContainer, osRowHeader.nextSibling);
        } else {
            OsContainer.classList.remove('OsContainer');
        }
    }
}

export {
    createOsDropdown,
}