import { jsonData, updateLocalStorage } from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function applyTaxToAll(taxRate) {
    const taxRatePercent = taxRate.Rate / 100
    const excludedCheckbox = document.querySelector('.taxTypeCheckboxes .excludedCheckbox');
    const includedCheckbox = document.querySelector('.taxTypeCheckboxes .includedCheckbox');

    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            item.TaxRateId = taxRate.TaxRateId
            if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                item.TaxValue = Number((item.Price * taxRatePercent).toFixed(2));
            } else if (includedCheckbox.querySelector('input[type="checkbox"]').checked) {
                item.TaxValue = Number(((item.Price * taxRatePercent) / (1 + taxRatePercent)).toFixed(2));
            }
            item.MenuItemOptionSets.forEach(os => {
                os.MenuItemOptionSetItems.forEach(option => {
                    option.TaxRateId = taxRate.TaxRateId
                    if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                        option.TaxValue = Number((option.Price * taxRatePercent).toFixed(2));
                    } else if (includedCheckbox.querySelector('input[type="checkbox"]').checked) {
                        option.TaxValue = Number(((option.Price * taxRatePercent) / (1 + taxRatePercent)).toFixed(2));
                    }
                })
            })
        })
    })

    const itemTaxPreviewArray = Array.from(document.getElementsByClassName('itemTax'));
    itemTaxPreviewArray.forEach(itemTaxPreview => {
        if (itemTaxPreview) {
            itemTaxPreview.textContent = taxRate.Rate + '%'
        }
    })

    const optionTaxPreviewArray = Array.from(document.getElementsByClassName('optionTaxPreview'));
    optionTaxPreviewArray.forEach(optionTaxPreview => {
        if (optionTaxPreview) {
            optionTaxPreview.textContent = taxRate.Rate + '%'
        }
    })

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export { applyTaxToAll }