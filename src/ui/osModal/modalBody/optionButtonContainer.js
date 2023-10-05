import {
    optionDuplicateButton
} from './optionDuplicate.js'

import {
    optionDeleteButton
} from './optionDelete.js'

import {
    optionVisibilityButton
} from './optionVisibility.js'

function createOptionButtonsCell(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, menuOption) {
    const optionButtonsCell = document.createElement('div');
    optionButtonsCell.classList = "optionButtonsCell"

    optionVisibilityButton(optionButtonsCell, optionRow, menuOption, sectionId, itemId, osId)

    optionDeleteButton(optionButtonsCell, optionRow, sectionId, itemId, osId, optionsBodyContainer)

    optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, optionButtonsCell, menuOption)

    return optionButtonsCell
}

export {
    createOptionButtonsCell
}