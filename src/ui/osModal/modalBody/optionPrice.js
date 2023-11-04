import {
    updateLocalStorage,
    getOsByGroupID
} from '../../context.js'

function createOptionPriceCell(menuOption, menuOs) {
    //Price Cell
    const optionPriceCell = document.createElement('div');
    optionPriceCell.classList.add('optionPriceCell');

    const optionPrice = createOptionPrice(menuOption, menuOs)
    optionPriceCell.appendChild(optionPrice);
    
    return optionPriceCell
}

//Handles Price Edits
function createOptionPrice(menuOption, menuOs) {
    const optionPrice = document.createElement('p');
    optionPrice.classList.add('optionPrice');
    optionPrice.contentEditable = true;
    
    const priceAsNumber = parseFloat(menuOption.Price);
    optionPrice.textContent = isNaN(priceAsNumber) ? '' : priceAsNumber.toFixed(2);

    let originalPrice = priceAsNumber;

    optionPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updatePrice(menuOption.groupOptionId, menuOs.groupOsId, optionPrice.textContent);
            originalPrice = parseFloat(optionPrice.textContent);
            optionPrice.blur();
    
            const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));
            
            const optionContainerPreview = optionContainerPreviewArray.filter((element) => {
              const groupOsId = element.getAttribute('groupOsId');
              return groupOsId === menuOs.groupOsId;
            });
            
            if (optionContainerPreview) {
                optionContainerPreview.forEach((optionPricePreview) => {
                    const optionPricePreviewArray = Array.from(optionPricePreview.getElementsByClassName('optionPricePreview'));
                    
                    optionPricePreviewArray.forEach(optionPricePreview => {
                        if (optionPricePreview.id === menuOption.groupOptionId) {
                            optionPricePreview.textContent = optionPrice.textContent;
                        }
                    });
                });
            }

        } else if (e.key === 'Escape') {
            optionPrice.textContent = originalPrice.toFixed(2);
            optionPrice.blur();
        }
    });

    optionPrice.addEventListener('blur', () => {
        optionPrice.textContent = originalPrice.toFixed(2);
        optionPrice.classList.remove('sectionClicked');
    });

    optionPrice.addEventListener('click', () => {
        optionPrice.classList.add('sectionClicked');
    });

    optionPrice.addEventListener('input', () => {
        const newPrice = optionPrice.textContent;
        const removeCharacters = newPrice.replace(/[^\d.]/g, '');
        optionPrice.textContent = removeCharacters;
    });

    return optionPrice;
}

function updatePrice(groupOptionId, groupOsId, optionPrice) {
    const priceAsNumber = parseFloat(parseFloat(optionPrice).toFixed(2));

    const matchingOS = getOsByGroupID(groupOsId)
    
    if (!isNaN(priceAsNumber)) {
        matchingOS.forEach(os => {
            const option = os.MenuItemOptionSetItems.find(option => option.groupOptionId == groupOptionId)
            option.Price = priceAsNumber
        })

        updateLocalStorage();
    }
}

export {
    createOptionPriceCell,
    createOptionPrice
}