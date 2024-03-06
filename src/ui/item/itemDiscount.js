import {
    jsonData,
    getItemIndex,
    updateLocalStorage,
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function itemDiscountButton(itemRow, menuItem, leftItemContainer, sectionId) {
    const discountButton = document.createElement('button');
    discountButton.classList.add('sectionButton')
    discountButton.classList.add('discountButton')
    discountButton.addEventListener('click', () => {
        handleDiscountVoucher(sectionId, itemRow.id);
    });
    leftItemContainer.appendChild(discountButton);
    const discountButtonImg = document.createElement('img')
    discountButtonImg.classList.add('sectionButtonImg')
    discountButtonImg.src = '../../assets/cashIcon.svg'
    discountButton.appendChild(discountButtonImg)

    if (menuItem.ExcludeFromVoucherDiscounting) {
        discountButton.classList.add('voucher')
    }

    discountButton.addEventListener('click', () => {
        if (menuItem.ExcludeFromVoucherDiscounting) {
            discountButton.classList.add('voucher')
        } else {
            discountButton.classList.remove('voucher')
        }
    })
}

//Discount Availability
function handleDiscountVoucher(sectionId, itemId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    if (itemIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].ExcludeFromVoucherDiscounting
        console.log(isAvailableNew);
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].ExcludeFromVoucherDiscounting = isAvailableNew

        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

export { itemDiscountButton }