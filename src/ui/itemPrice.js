// import {
//     updateSectionLocalStorage,
//     jsonData,
//     getItemIndex,
// } from './context.js'

// function createItemPriceCell(itemRow, menuItem, sectionId) {
//     //Price Cell
//     const itemPriceCell = document.createElement('td');
//     itemPriceCell.classList.add('itemPriceCell');

//     const itemPrice = createItemPrice(itemRow, menuItem, sectionId)
//     itemPriceCell.appendChild(itemPrice);
    
//     return itemPriceCell
// }

// //Handles Price Edits
// function createItemPrice(itemRow, menuItem, sectionId) {
//     const itemPrice = document.createElement('p');
//     itemPrice.classList.add('itemPrice');
//     itemPrice.contentEditable = true;
//     itemPrice.textContent = menuItem.Price;

//     let originalPrice = menuItem.Price;

//     itemPrice.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             updatePrice(itemRow.id, itemPrice.textContent, sectionId);
//             originalPrice = itemPrice.textContent;
//             itemPrice.blur();
//         } else if (e.key === 'Escape') {
//             itemPrice.textContent = originalPrice;
//             itemPrice.blur();
//         }
//     });

//     itemPrice.addEventListener('blur', () => {
//         itemPrice.textContent = originalPrice;
//         itemPrice.classList.remove('sectionClicked')
//     });

//     itemPrice.addEventListener('click', () => {
//         itemPrice.classList.add('sectionClicked')
//     })

//     return itemPrice
// }

// //Updates Price
// function updatePrice(itemId, itemPrice, sectionId) {
//     const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
//     jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Price = itemPrice;

//     updateSectionLocalStorage()
// }

// export {
//     createItemPriceCell,
//     createItemPrice
// }


import {
    updateSectionLocalStorage,
    jsonData,
    getItemIndex,
} from './context.js'

function createItemPriceCell(itemRow, menuItem, sectionId) {
    //Price Cell
    const itemPriceCell = document.createElement('td');
    itemPriceCell.classList.add('itemPriceCell');

    const itemPrice = createItemPrice(itemRow, menuItem, sectionId)
    itemPriceCell.appendChild(itemPrice);
    
    return itemPriceCell
}

//Handles Price Edits
function createItemPrice(itemRow, menuItem, sectionId) {
    const itemPrice = document.createElement('p');
    itemPrice.classList.add('itemPrice');
    itemPrice.contentEditable = true;
    itemPrice.textContent = menuItem.Price;

    let originalPrice = menuItem.Price;

    itemPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const enteredText = itemPrice.textContent.trim();
            if (/^[0-9]+(\.[0-9]*)?$/.test(enteredText)) {
                // Ensure the entered text is a valid number or a decimal
                if (!enteredText.includes('.')) {
                    // If it's an integer, add ".00"
                    itemPrice.textContent = enteredText + '.00';
                }
                updatePrice(itemRow.id, itemPrice.textContent, sectionId);
                originalPrice = itemPrice.textContent;
                itemPrice.blur();
            } else {
                // Not a valid number, revert to original price
                itemPrice.textContent = originalPrice;
                itemPrice.blur();
            }
        } else if (e.key === 'Escape') {
            itemPrice.textContent = originalPrice;
            itemPrice.blur();
        }
    });

    itemPrice.addEventListener('blur', () => {
        itemPrice.textContent = originalPrice;
        itemPrice.classList.remove('sectionClicked');
    });

    itemPrice.addEventListener('click', () => {
        itemPrice.classList.add('sectionClicked');
    });

    // Use the input event to prevent non-numeric characters
    itemPrice.addEventListener('input', () => {
        const enteredText = itemPrice.textContent;
        const sanitizedText = enteredText.replace(/[^\d.]/g, '');
        itemPrice.textContent = sanitizedText;
    });

    return itemPrice;
}

//Updates Price
function updatePrice(itemId, itemPrice, sectionId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Price = itemPrice;

    updateSectionLocalStorage()
}

export {
    createItemPriceCell,
    createItemPrice
}

