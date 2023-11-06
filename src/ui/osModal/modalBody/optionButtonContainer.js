import { optionDuplicateButton } from './optionDuplicate.js'

import { optionDeleteButton } from './optionDelete.js'

import { optionVisibilityButton } from './optionVisibility.js'

function createOptionButtonsCell(optionRow, menuOs, optionRowsContainer, menuOption) {
    const optionButtonsCell = document.createElement('div');
    optionButtonsCell.classList = "optionButtonsCell"

    optionVisibilityButton(optionButtonsCell, optionRow, menuOption, menuOs)

    optionDeleteButton(optionButtonsCell, menuOs, menuOption, optionRow, optionRowsContainer)

    optionDuplicateButton(optionRow, optionRowsContainer, optionButtonsCell, menuOption, menuOs)

    return optionButtonsCell
}

export { createOptionButtonsCell }