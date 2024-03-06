import {
    jsonData,
    getItemIndex,
    getSectionRow,
    updateLocalStorage,
    groupOptionSets,
    groupedOs,
    addItemlessOs,
    closeOsModalContainer
} from '../context.js';

import { changeSectionClockIconColor, changeSectionClockIcon } from '../clock/sectionClock.js';

import { slotManagerInstance } from '../mainContainer.js';

function itemLockButton(leftItemContainer, itemRow, sectionId) {
    const lockButton = document.createElement('button');
    lockButton.classList.add('sectionButton')
    lockButton.classList.add('lockButton')
    leftItemContainer.appendChild(lockButton);
    const lockButtonImg = document.createElement('img')
    lockButtonImg.classList.add('sectionButtonImg')
    lockButtonImg.src = '../../assets/lockIcon.svg'
    lockButton.appendChild(lockButtonImg)
    lockButton.addEventListener('click', () => {
        // confirmDelete(itemRow, leftItemContainer, sectionId)
    });
}

export { itemLockButton }