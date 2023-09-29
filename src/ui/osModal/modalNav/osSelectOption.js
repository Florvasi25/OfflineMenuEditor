import {
    createMinCountCell
} from './osMinCount.js'

import {
    createMaxCountCell
} from './osMaxCount.js'

import {
    createMaxLenghtButton
} from './osMaxLength.js'

function createSelectOptionContainer(menuOs, itemId, sectionId) {
    const selectOptionContainer = document.createElement('div')
    selectOptionContainer.className = 'selectOptionContainer'

    const selectOptionCell = createSelectOptionCell(menuOs, itemId, sectionId)
    selectOptionContainer.appendChild(selectOptionCell)

    createMaxLenghtButton(selectOptionContainer)

    return selectOptionContainer
}

function createSelectOptionCell(menuOs, itemId, sectionId) {
    const selectOptionCell = document.createElement('div')
    selectOptionCell.className = 'selectOptionCell'

    const selectOption = createSelectOption(menuOs, itemId, sectionId)
    selectOptionCell.appendChild(selectOption)

    return selectOptionCell
}

function createSelectOption(menuOs, itemId, sectionId) {
    const selectOption = document.createElement('div')
    selectOption.className = 'selectOption'

    const minCountCell = createMinCountCell(menuOs, itemId, sectionId)
    selectOption.appendChild(minCountCell)

    const dashCountCell = document.createElement('p')
    dashCountCell.className = 'dashCountCell'
    dashCountCell.textContent= '-'
    selectOption.appendChild(dashCountCell)
    
    const maxCountCell = createMaxCountCell(menuOs, itemId, sectionId)
    selectOption.appendChild(maxCountCell)

    return selectOption
}

export { createSelectOptionContainer }