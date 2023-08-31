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

import {
    createSectionName
} from './sectionName.js'

function createSectionButtonsCell(sectionRow, menuSection) {
    const sectionButtonsCell = document.createElement('td');
    sectionButtonsCell.classList = "sectionButtonsCell"

    const sectionName = createSectionName(sectionRow, menuSection)

    sectionClockButton(sectionButtonsCell)

    sectionDeleteButton(sectionButtonsCell, sectionRow, sectionName)

    sectionVisibilityButton(sectionRow, menuSection, sectionButtonsCell)

    sectionDuplicateButton(sectionRow, sectionButtonsCell, menuSection)


    return sectionButtonsCell
}

export {
    createSectionButtonsCell
}