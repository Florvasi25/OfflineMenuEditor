import {
    sectionClockButton,
} from './sectionClock.js'

import {
    sectionVisibilityButton
} from './sectionVisibility.js'

import {
    sectionDeleteButton
} from './sectionDelete.js'

import {
    sectionDuplicateButton,
} from './sectionDuplicate.js'

function createSectionButtonsCell(sectionRow, menuSection) {
    const sectionButtonsCell = document.createElement('td');
    sectionButtonsCell.classList = "sectionButtonsCell"

    sectionClockButton(sectionButtonsCell, menuSection.MenuSectionId)

    sectionDeleteButton(sectionButtonsCell, sectionRow)

    sectionVisibilityButton(sectionRow, menuSection, sectionButtonsCell)

    sectionDuplicateButton(sectionRow, sectionButtonsCell, menuSection)


    return sectionButtonsCell
}

export {
    createSectionButtonsCell
}