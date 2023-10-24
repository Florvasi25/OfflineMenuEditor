import { groupedOs } from '../../context.js';

import { createSelectOsDropdown } from './selectOsDropDown.js'

function createSelectOsModalBody() {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const selectOsBodyLeft = createSelectOsBodyLeft()
    selectOsModalBody.appendChild(selectOsBodyLeft)

    const selectOsBodyRight = createSectionBodyRight()
    selectOsModalBody.appendChild(selectOsBodyRight)

    return selectOsModalBody;
}

function createSelectOsBodyLeft() {
    const selectOsBodyLeft = document.createElement('div')
    selectOsBodyLeft.className = 'selectOsBodyLeft';

    const groupsArray = Object.values(groupedOs).map(item => {
        if (Array.isArray(item)) {
            return item[0];
        } else {
            return item;
        }
    });

    groupsArray.forEach((osGroup, index) => {
        const selectOsRowHeader = createSelectOsRow(osGroup)
        
        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    return selectOsBodyLeft
}

function createSectionBodyRight() {
    const selectOsBodyRight = document.createElement('div')
    selectOsBodyRight.className = 'selectOsBodyRight';

    return selectOsBodyRight
}

function createSelectOsRow(osGroup) {
    const selectOsRowHeader = document.createElement('div');
    selectOsRowHeader.classList.add('selectOsRowHeader');
    selectOsRowHeader.classList.add('defaultColor');
    selectOsRowHeader.classList.add('draggable');
    selectOsRowHeader.classList.add('folded')
    selectOsRowHeader.id = osGroup.MenuItemOptionSetId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    selectOsRowHeader.appendChild(dropAndName)

    const osDropDown = createSelectOsDropdown(selectOsRowHeader, osGroup)
    dropAndName.appendChild(osDropDown)

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createSelectOsNameHeader(osGroup)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(osGroup)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(osGroup)
    selectOsRowHeader.appendChild(osSelectOptionContainer)

    return selectOsRowHeader
}

function createSelectOsNameHeader(osGroup) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'selectOsNameHeader'
    osNameHeader.textContent = osGroup.Name
    osNameHeader.id = osGroup.groupOsId

    return osNameHeader
}

function createOptionSetIdPreview(osGroup) {
    const optionSetIdPreview = document.createElement('p')
    optionSetIdPreview.textContent = osGroup.MenuItemOptionSetId
    optionSetIdPreview.className = 'optionSetIdPreview'

    return optionSetIdPreview
}

function createOsSelectOption(osGroup) {
    const osSelectOptionContainer = document.createElement('div')
    osSelectOptionContainer.className = 'osSelectOptionContainer'
    osSelectOptionContainer.innerHTML = `
    <p class='minSelectCount' id='${osGroup.groupOsId}'>${osGroup.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount' id='${osGroup.groupOsId}'>${osGroup.MaxSelectCount}</p>`
    
    return osSelectOptionContainer
}

export { createSelectOsModalBody };