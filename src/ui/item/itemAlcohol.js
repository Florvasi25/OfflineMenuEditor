import {
    jsonData,
    getItemIndex,
    updateLocalStorage,
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function itemAlcoholButton(itemRow, menuItem, leftItemContainer, sectionId) {
    const alcoholButton = document.createElement('button');
    alcoholButton.classList.add('sectionButton')
    alcoholButton.classList.add('alcoholButton')
    alcoholButton.addEventListener('click', () => {
        handleAlcoholVoucher(itemRow, sectionId, itemRow.id);
    });
    leftItemContainer.appendChild(alcoholButton);
    const alcoholButtonImg = document.createElement('img')
    alcoholButtonImg.classList.add('sectionButtonImg')
    alcoholButtonImg.src = '../../assets/alcoholIcon.svg'
    alcoholButton.appendChild(alcoholButtonImg)

    if (menuItem.Alcohol) {
        alcoholButton.classList.add('voucher')
    }

    alcoholButton.addEventListener('click', () => {
        if (menuItem.Alcohol) {
            alcoholButton.classList.add('voucher')
        } else {
            alcoholButton.classList.remove('voucher')
        }
    })
}

//Alcohol Availability
function handleAlcoholVoucher(itemRow, sectionId, itemId) {

    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    if (itemIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Alcohol
        console.log(isAvailableNew);
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Alcohol = isAvailableNew

        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

export { itemAlcoholButton }