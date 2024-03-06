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

function itemDiscountButton(leftItemContainer, itemRow, sectionId) {
    const discountButton = document.createElement('button');
    discountButton.classList.add('sectionButton')
    discountButton.classList.add('discountButton')
    leftItemContainer.appendChild(discountButton);
    const discountButtonImg = document.createElement('img')
    discountButtonImg.classList.add('sectionButtonImg')
    discountButtonImg.src = '../../assets/cashIcon.svg'
    discountButton.appendChild(discountButtonImg)
    discountButton.addEventListener('click', () => {
        // confirmDelete(itemRow, leftItemContainer, sectionId)
    });
}

export { itemDiscountButton }