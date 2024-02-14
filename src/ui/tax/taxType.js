import { jsonData, updateLocalStorage } from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function createTaxTypeContainer(jsonData) {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeContainer';

    const taxTypeTitle = document.createElement('p');
    taxTypeTitle.className = 'taxTypeTitle';
    taxTypeTitle.textContent = 'Tax Type';

    const taxTypeCheckboxes = createTaxTypeCheckboxes(jsonData);

    taxTypeContainer.appendChild(taxTypeTitle);
    taxTypeContainer.appendChild(taxTypeCheckboxes);

    return taxTypeContainer;
}

function createTaxTypeCheckboxes(jsonData) {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeCheckboxes';

    const excludedCheckbox = taxTypeCheckbox('Excluded');
    excludedCheckbox.classList.add('excludedCheckbox')
    const includedCheckbox = taxTypeCheckbox('Included');
    includedCheckbox.classList.add('includedCheckbox')

    taxTypeContainer.appendChild(excludedCheckbox);
    taxTypeContainer.appendChild(includedCheckbox);

    // Determine initial checkbox state based on jsonData.TaxType
    if (jsonData.TaxType === 1) {
        excludedCheckbox.querySelector('input[type="checkbox"]').checked = true;
    } else {
        includedCheckbox.querySelector('input[type="checkbox"]').checked = true;
    }

    excludedCheckbox.addEventListener('change', () => {
        if (excludedCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.TaxType = 1; // Update jsonData.TaxType
            includedCheckbox.querySelector('input[type="checkbox"]').checked = false;

            const trueCheckbox = document.querySelector('.displayTaxCheckboxes .trueCheckbox');
            trueCheckbox.querySelector('input[type="checkbox"]').checked = true;

            jsonData.DisplayTax = true;

            const falseCheckbox = document.querySelector('.displayTaxCheckboxes .falseCheckbox');
            falseCheckbox.querySelector('input[type="checkbox"]').checked = false;

            calculateExcludedTaxValue()

            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

    includedCheckbox.addEventListener('change', () => {
        if (includedCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.TaxType = 0; // Update jsonData.TaxType
            excludedCheckbox.querySelector('input[type="checkbox"]').checked = false;

            calculateIncludedTaxValue()

            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

    return taxTypeContainer;
}

function taxTypeCheckbox(taxTypeValue) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkboxContainer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.className = 'checkboxLabel';
    label.textContent = taxTypeValue;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

function calculateExcludedTaxValue() {
    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            const itemTaxRateId = item.TaxRateId
            const itemTaxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == itemTaxRateId).Rate / 100
            item.TaxValue = Number((item.Price * itemTaxRate).toFixed(2));
            item.MenuItemOptionSets.forEach(os => {
                os.MenuItemOptionSetItems.forEach(option => {
                    const optionTaxRateId = option.TaxRateId
                    const optionTaxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == optionTaxRateId).Rate / 100
                    option.TaxValue = Number((option.Price * optionTaxRate).toFixed(2));
                })
            })
        })
    })
}

function calculateIncludedTaxValue() {
    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            const itemTaxRateId = item.TaxRateId
            const itemTaxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == itemTaxRateId).Rate / 100
            item.TaxValue = Number(((item.Price * itemTaxRate) / (1 + itemTaxRate)).toFixed(2))
            item.MenuItemOptionSets.forEach(os => {
                os.MenuItemOptionSetItems.forEach(option => {
                    const optionTaxRateId = option.TaxRateId
                    const optionTaxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == optionTaxRateId).Rate / 100
                    option.TaxValue = Number(((option.Price * optionTaxRate) / (1 + optionTaxRate)).toFixed(2));
                })
            })
        })
    })
}

export { createTaxTypeContainer }