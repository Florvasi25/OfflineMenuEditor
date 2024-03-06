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

function itemAlcoholButton(leftItemContainer, itemRow, sectionId) {
    const alcoholButton = document.createElement('button');
    alcoholButton.classList.add('sectionButton')
    alcoholButton.classList.add('alcoholButton')
    leftItemContainer.appendChild(alcoholButton);
    const alcoholButtonImg = document.createElement('img')
    alcoholButtonImg.classList.add('sectionButtonImg')
    alcoholButtonImg.src = '../../assets/alcoholIcon.svg'
    alcoholButton.appendChild(alcoholButtonImg)
    alcoholButton.addEventListener('click', () => {
        // confirmDelete(itemRow, leftItemContainer, sectionId)
    });
}

export { itemAlcoholButton }