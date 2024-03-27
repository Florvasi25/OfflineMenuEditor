import { 
    updateLocalStorage,
    itemlessOs,
    jsonData,
    addWarningMoM,
    groupedOs,
    groupOptionSets,
    updateItemlessLocalStorage
} from "../../context.js";

import { slotManagerInstance } from  "../../mainContainer.js";

import { showToolTip } from "../../toolTip.js";

function createSamePriceButton(menuOs, topButtonsCell) {
    const samePriceContainer = document.createElement('div')
    samePriceContainer.className = 'sameMoMContainer'
    
    const samePriceInput = document.createElement('p')
    samePriceInput.classList.add('samePriceInput')
    samePriceInput.contentEditable = true
    samePriceInput.textContent = 'Edit all Prices'

    samePriceInput.addEventListener('click', (e) => {
        samePriceInput.textContent = ""
        samePriceInput.style.textAlign = 'center'
        samePriceInput.style.color = '#000000'
    })

    // Modify keydown event listener to allow only whole numbers and decimals
    samePriceInput.addEventListener('keydown', (e) => {
        const allowedChars = /^[0-9.\b]+$/;
        const value = e.target.textContent + e.key;
        if (!allowedChars.test(value)) {
            e.preventDefault();
        }
    })
    
    const samePriceButton = document.createElement('button');
    samePriceButton.classList.add('sectionButton');
    samePriceButton.classList.add('sameMoMButton');
    
    samePriceContainer.appendChild(samePriceInput);
    samePriceContainer.appendChild(samePriceButton);
    topButtonsCell.appendChild(samePriceContainer);
    
    const samePriceButtonImg = document.createElement('img')
    samePriceButtonImg.classList.add('sectionButtonImg')
    samePriceButtonImg.src = '../../assets/checkIcon.svg'
    samePriceButton.appendChild(samePriceButtonImg)
    
    samePriceButton.addEventListener('click', () => {
        const textPrice = document.getElementsByClassName('samePriceInput')[0].textContent
        
        checkPrice(textPrice, menuOs, samePriceInput)
    })
    
    samePriceInput.addEventListener('blur', (e) => {
        if (samePriceInput.textContent == '') {
            samePriceInput.textContent = 'Edit all Prices'
            samePriceInput.style.color = '#a3a3a3'
        }
    })

    // Handle the paste event to strip formatting
    samePriceInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });
}

function checkPrice(textPrice, menuOs, samePriceInput) {
    let enteredPrice = textPrice.trim();
    const regex = /^\d+(\.\d{1,})?$/; // Updated regex to allow one or more decimals
    
    if (regex.test(enteredPrice)) {
        // Ensure only two decimals are kept
        const roundedPrice = parseFloat(enteredPrice).toFixed(2);
        textPrice = roundedPrice;
        console.log(textPrice);
    } 

    handleSamePrice(menuOs, samePriceInput, textPrice)
    addWarningMoM()
}

function handleSamePrice(menuOs, samePriceInput, textPrice) {
        
        if (textPrice == "Edit all Prices") {
            return
        } 

        updateAllOptionPrices(menuOs, textPrice)

        if (groupedOs[menuOs.groupOsId]) {
            // Extracting all option ids belonging to the groupOsId
            const optionsIds = groupedOs[menuOs.groupOsId].flatMap(os =>
                os.MenuItemOptionSetItems.map(option => option.MenuItemOptionSetItemId.toString())
            );
        
            // Filtering all option price elements belonging to the extracted option ids
            const optionPricePreviewArray = Array.from(document.getElementsByClassName('optionPricePreview'));
            const optionPricePreview = optionPricePreviewArray.filter(p => optionsIds.includes(p.id));
        
            // Updating prices for all found option price elements
            optionPricePreview.forEach(os => {
                os.textContent = parseFloat(textPrice).toFixed(2);
            });
        }
        
    
        const optionPriceModal = Array.from(document.getElementsByClassName('optionPrice'))
        optionPriceModal.forEach(optionPrice => {
            optionPrice.textContent = textPrice
            optionPrice.style.color = '#000000'
        })
    
    samePriceInput.textContent = 'Edit all Prices'
    samePriceInput.style.color = '#a3a3a3'
}

function updateAllOptionPrices(menuOs, textPrice) {
    const priceAsNumber = parseFloat(parseFloat(textPrice).toFixed(2));

    const excludedCheckbox = document.querySelector('.taxTypeCheckboxes .excludedCheckbox');
    const includedCheckbox = document.querySelector('.taxTypeCheckboxes .includedCheckbox');

    if (!isNaN(priceAsNumber)) {
        if (groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                os.MenuItemOptionSetItems.forEach(option => {
                    option.Price = priceAsNumber
    
                    if (option.TaxRateId != null) {
                        const optionTaxId = option.TaxRateId
                        const taxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == optionTaxId)
                        const taxRatePercent = taxRate.Rate / 100
        
                        if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                            option.TaxValue = Number((option.Price * taxRatePercent).toFixed(2));
                        } else if (includedCheckbox.querySelector('input[type="checkbox"]').checked) {
                            option.TaxValue = Number(((option.Price * taxRatePercent) / (1 + taxRatePercent)).toFixed(2));
                        }
                    }
                })
            })
            groupOptionSets();
            updateLocalStorage(slotManagerInstance.currentSlot);
        } else if (itemlessOs.includes(menuOs)){
            menuOs.MenuItemOptionSetItems.forEach(option => {
                option.Price = priceAsNumber
    
                if (jsonData.TaxRates.length > 0) {
                    const optionTaxId = option.TaxRateId
                    const taxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == optionTaxId)
                    const taxRatePercent = taxRate.Rate / 100
        
                    if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                        option.TaxValue = Number((option.Price * taxRatePercent).toFixed(2));
                    } else if (includedCheckbox.querySelector('input[type="checkbox"]').checked) {
                        option.TaxValue = Number(((option.Price * taxRatePercent) / (1 + taxRatePercent)).toFixed(2));
                    }
                }
                updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
            })
        }
    }
}

export { createSamePriceButton }