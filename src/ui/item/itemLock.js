import {
    jsonData,
    getItemIndex,
    updateLocalStorage,
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function itemLockButton(itemRow, menuItem, leftItemContainer, sectionId) {
    const lockButton = document.createElement('button');
    lockButton.classList.add('sectionButton')
    lockButton.classList.add('lockButton')
    lockButton.addEventListener('click', () => {
        handleLockVoucher(sectionId, itemRow.id);
    });
    leftItemContainer.appendChild(lockButton);
    const lockButtonImg = document.createElement('img')
    lockButtonImg.classList.add('sectionButtonImg')
    lockButtonImg.src = '../../assets/lockIcon.svg'
    lockButton.appendChild(lockButtonImg)

    if (menuItem.DisableVouchers) {
        lockButton.classList.add('voucher')
    }

    lockButton.addEventListener('click', () => {
        if (menuItem.DisableVouchers) {
            lockButton.classList.add('voucher')
        } else {
            lockButton.classList.remove('voucher')
        }
    })
}

//Discount Availability
function handleLockVoucher(sectionId, itemId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    if (itemIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].DisableVouchers
        console.log(isAvailableNew);
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].DisableVouchers = isAvailableNew

        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

export { itemLockButton }