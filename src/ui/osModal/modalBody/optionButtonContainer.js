import {
    optionDuplicateButton
} from './optionDuplicate.js'

import {
    optionDeleteButton
} from './optionDelete.js'

function createOptionButtonsCell(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer) {
    const optionButtonsCell = document.createElement('div');
    optionButtonsCell.classList = "optionButtonsCell"

    optionDeleteButton(optionButtonsCell, optionRow, sectionId, itemId, osId, optionsBodyContainer)

    optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, optionButtonsCell)

    return optionButtonsCell
}

export {
    createOptionButtonsCell
}