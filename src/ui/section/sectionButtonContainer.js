import { sectionClockButton } from '../clock/sectionClock.js'

import { sectionVisibilityButton } from './sectionVisibility.js'

import { sectionDeleteButton } from './sectionDelete.js'

import { sectionDuplicateButton } from './sectionDuplicate.js'

import { sectionListButton } from './sectionList.js'

function createSectionButtonsCell(sectionRow, menuSection) {
    const sectionButtonsCell = document.createElement('div');
    sectionButtonsCell.classList = "sectionButtonsCell"

    const leftSectionContainer = document.createElement('div');

    sectionClockButton(leftSectionContainer, menuSection.MenuSectionId)
    sectionListButton(leftSectionContainer, menuSection);
    
    const rightSectionContainer = document.createElement('div')

    sectionDeleteButton(rightSectionContainer, sectionRow)
    sectionVisibilityButton(sectionRow, menuSection, rightSectionContainer)
    sectionDuplicateButton(sectionRow, rightSectionContainer, menuSection)

    sectionButtonsCell.appendChild(leftSectionContainer)
    sectionButtonsCell.appendChild(rightSectionContainer)
    
    return sectionButtonsCell
}

export { createSectionButtonsCell }