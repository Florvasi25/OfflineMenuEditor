import { createOptionsContainer } from './selectOsOptions.js'

function createSelectOsDropdown(selectOsRowHeader, osGroup){
    const osDropdownCell = document.createElement('div')
    osDropdownCell.classList.add('osDropdownCell')
    osDropdownCell.classList.add('osModal')

    const boxDropdownButton = createSelectOsDropdownButton(selectOsRowHeader, osGroup)
    osDropdownCell.appendChild(boxDropdownButton)

    return osDropdownCell
}

function createSelectOsDropdownButton(selectOsRowHeader, osGroup){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="osDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleItemState(selectOsRowHeader, osGroup);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleItemState(selectOsRowHeader, osGroup) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (selectOsRowHeader.classList.contains(expandedClassName)) {
        selectOsRowHeader.classList.remove(expandedClassName);
        selectOsRowHeader.classList.add(foldedClassName);

        const osOptionContainer = selectOsRowHeader.nextElementSibling;
        if (osOptionContainer && osOptionContainer.classList.contains('osOptionContainer')) {
            osOptionContainer.classList.add('selectOsRowHeader');
            osOptionContainer.remove(); // Remove the content container
        }
    } else {
        selectOsRowHeader.classList.remove(foldedClassName);
        selectOsRowHeader.classList.add(expandedClassName);

        let osOptionContainer = selectOsRowHeader.nextElementSibling;
        if (!osOptionContainer || !osOptionContainer.classList.contains('osOptionContainer')) {
            createOptionsContainer(selectOsRowHeader, osGroup)
        } else {
            osOptionContainer.classList.remove('osOptionContainer');
        }
    }
}

export { createSelectOsDropdown }