import { optionDuplicateButton } from './optionDuplicate.js'

import { optionDeleteButton } from './optionDelete.js'

import { optionVisibilityButton } from './optionVisibility.js'

function createOptionButtonsCell(optionRow, optionId, sectionId, itemId, osId, optionRowsContainer, menuOption) {
    const optionButtonsCell = document.createElement('div');
    optionButtonsCell.classList = "optionButtonsCell"

    optionVisibilityButton(optionButtonsCell, optionRow, menuOption, sectionId, itemId, osId)

    optionDeleteButton(optionButtonsCell, optionRow, sectionId, itemId, osId, optionRowsContainer)

    optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionRowsContainer, optionButtonsCell, menuOption)

    return optionButtonsCell
}

export { createOptionButtonsCell }