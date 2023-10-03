import {
    optionDuplicateButton
} from './optionDuplicate.js'

function createOptionButtonsCell(optionRow, optionId, sectionId, itemId, osId, optionsContainer, menuOption) {
    const optionButtonsCell = document.createElement('div');
    optionButtonsCell.classList = "optionButtonsCell"

    optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionsContainer, optionButtonsCell, menuOption)

    return optionButtonsCell
}

export {
    createOptionButtonsCell
}