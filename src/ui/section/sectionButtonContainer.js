import { sectionVisibilityButton } from './sectionVisibility.js'

import { sectionDeleteButton } from './sectionDelete.js'

import { sectionDuplicateButton } from './sectionDuplicate.js'

import { sectionClockButton } from '../clock/sectionClock.js'

function createSectionButtonsCell(sectionRow, menuSection) {
    const sectionButtonsCell = document.createElement('div');
    sectionButtonsCell.classList = "sectionButtonsCell"

    sectionClockButton(sectionButtonsCell, menuSection.MenuSectionId)
    sectionVisibilityButton(sectionRow, menuSection, sectionButtonsCell)
    sectionDuplicateButton(sectionRow, sectionButtonsCell, menuSection)
    sectionDeleteButton(sectionButtonsCell, sectionRow)
    
    return sectionButtonsCell
}

export { createSectionButtonsCell }