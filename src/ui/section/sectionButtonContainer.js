import { sectionClockButton } from '../clock/sectionClock.js'

import { sectionVisibilityButton } from './sectionVisibility.js'

import { sectionDeleteButton } from './sectionDelete.js'

import { sectionDuplicateButton } from './sectionDuplicate.js'

import { sectionListButton } from './sectionList.js'

function createSectionButtonsCell(sectionRow, menuSection) {
    const sectionButtonsCell = document.createElement('div');
    sectionButtonsCell.classList = "sectionButtonsCell"

    sectionClockButton(sectionButtonsCell, menuSection.MenuSectionId)

    sectionDeleteButton(sectionButtonsCell, sectionRow)

    sectionVisibilityButton(sectionRow, menuSection, sectionButtonsCell)

    sectionDuplicateButton(sectionRow, sectionButtonsCell, menuSection)

    sectionListButton(sectionButtonsCell, menuSection);
    
    return sectionButtonsCell
}

export { createSectionButtonsCell }