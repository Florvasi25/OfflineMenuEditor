import { groupedOs } from '../../context.js';

function createSelectOsModalBody() {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const groupsArray = Object.values(groupedOs).map(item => {
        if (Array.isArray(item)) {
            return item[0];
        } else {
            return item;
        }
    });

    console.log('groupsArray', groupsArray);

    groupsArray.forEach((group, index) => {
        const selectOsRowHeader = createOsRow(group)
        
        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsModalBody.appendChild(selectOsRowHeader)
    })

    return selectOsModalBody;
}

function createOsRow(group) {
    const osRowHeader = document.createElement('div');
    osRowHeader.classList.add('selectOsRowHeader');
    osRowHeader.classList.add('defaultColor');
    osRowHeader.classList.add('draggable');
    osRowHeader.classList.add('folded')
    osRowHeader.id = group.MenuItemOptionSetId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    osRowHeader.appendChild(dropAndName)

    // const osDropDown = createOsDropdown(osRowHeader, group, sectionId, itemId)
    // dropAndName.appendChild(osDropDown)

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createOsNameHeader(group)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(group)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(group)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

function createOsNameHeader(group) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'selectOsNameHeader'
    osNameHeader.textContent = group.Name
    osNameHeader.id = group.groupOsId

    return osNameHeader
}

function createOptionSetIdPreview(group) {
    const optionSetIdPreview = document.createElement('p')
    optionSetIdPreview.textContent = group.MenuItemOptionSetId
    optionSetIdPreview.className = 'optionSetIdPreview'

    return optionSetIdPreview
}

function createOsSelectOption(group) {
    const osSelectOptionContainer = document.createElement('div')
    osSelectOptionContainer.className = 'osSelectOptionContainer'
    osSelectOptionContainer.innerHTML = `
    <p class='minSelectCount' id='${group.groupOsId}'>${group.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount' id='${group.groupOsId}'>${group.MaxSelectCount}</p>`
    
    return osSelectOptionContainer
}

export { createSelectOsModalBody };