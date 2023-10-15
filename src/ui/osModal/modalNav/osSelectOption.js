import { createMinCountCell } from './osMinCount.js'

import { createMaxCountCell } from './osMaxCount.js'

import { createMaxLenghtButton } from './osMaxLength.js'

function createSelectOptionContainer(menuOs) {
    const selectOptionContainer = document.createElement('div')
    selectOptionContainer.className = 'selectOptionContainer'

    const selectOptionCell = createSelectOptionCell(menuOs)
    selectOptionContainer.appendChild(selectOptionCell)

    createMaxLenghtButton(selectOptionContainer, menuOs)

    return selectOptionContainer
}

function createSelectOptionCell(menuOs) {
    const selectOptionCell = document.createElement('div')
    selectOptionCell.className = 'selectOptionCell'

    const selectOption = createSelectOption(menuOs)
    selectOptionCell.appendChild(selectOption)

    return selectOptionCell
}

function createSelectOption(menuOs) {
    const selectOption = document.createElement('div')
    selectOption.className = 'selectOption'

    const minCountCell = createMinCountCell(menuOs)
    selectOption.appendChild(minCountCell)

    const dashCountCell = document.createElement('p')
    dashCountCell.className = 'dashCountCell'
    dashCountCell.textContent= '-'
    selectOption.appendChild(dashCountCell)
    
    const maxCountCell = createMaxCountCell(menuOs)
    selectOption.appendChild(maxCountCell)

    return selectOption
}

export { createSelectOptionContainer }