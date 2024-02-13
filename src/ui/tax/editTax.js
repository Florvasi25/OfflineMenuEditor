import { 
    updateLocalStorage,
    jsonData
} from '../context.js';

import { showToolTip } from '../toolTip.js';

import { slotManagerInstance } from '../mainContainer.js';

function editTax(savedTaxContainer, taxRate, savedTaxName, savedTaxRate) {
    const editTaxContainer = document.createElement('div');
    editTaxContainer.className = 'editTaxContainer';
    editTaxContainer.id = taxRate.TaxRateId

    const taxNameContainer = document.createElement('div');
    taxNameContainer.className = 'taxNameContainer';

    const taxNameTitle = document.createElement('p');
    taxNameTitle.className = 'taxNameTitle';
    taxNameTitle.textContent = 'Tax Name';

    const taxName = document.createElement('p')
    taxName.contentEditable = true
    taxName.className = 'taxName'
    taxName.textContent = taxRate.Name

    taxNameContainer.appendChild(taxNameTitle);
    taxNameContainer.appendChild(taxName);

    const taxPercentContainer = document.createElement('div');
    taxPercentContainer.className = 'taxPercentContainer';

    const taxPercentTitle = document.createElement('p');
    taxPercentTitle.className = 'taxPercentTitle';
    taxPercentTitle.textContent = 'Tax Percent';

    const taxPercent = document.createElement('p')
    taxPercent.contentEditable = true
    taxPercent.className = 'taxPercent'
    taxPercent.textContent = taxRate.Rate

    let previousRateValue = taxRate.Rate

    taxPercent.addEventListener('input', function(event) {
        let enteredValue = taxPercent.textContent.replace(/[^\d.]/g, '');
        enteredValue = enteredValue.replace(/(\..*)\./g, '$1');
    
        taxPercent.textContent = enteredValue;
    });
    
    taxPercent.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxPercent.textContent;
            previousRateValue = enteredValue; 
            taxPercent.blur()
        }
    });
    
    taxPercent.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxPercent.textContent = previousRateValue;
        }
    });

    let previousTaxName = taxRate.Name

    taxName.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxName.textContent;
            previousTaxName = enteredValue; 
            taxName.blur()
        }
    });
    
    taxName.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxName.textContent = previousTaxName;
        }
    });

    const saveTaxButton = document.createElement('button');
    saveTaxButton.classList.add('saveTaxButton');
    saveTaxButton.classList.add('taxButton')
    saveTaxButton.textContent = 'Save Tax';
    
    saveTaxButton.addEventListener('click', () => {
        updateTax(taxPercent, savedTaxContainer, editTaxContainer, savedTaxName, savedTaxRate, taxRate)
    });
    
    taxPercentContainer.appendChild(taxPercentTitle);
    taxPercentContainer.appendChild(taxPercent);
    taxPercentContainer.appendChild(saveTaxButton);
    
    editTaxContainer.appendChild(taxNameContainer);
    editTaxContainer.appendChild(taxPercentContainer);
    
    savedTaxContainer.replaceWith(editTaxContainer)
}

function updateTax(taxPercent, savedTaxContainer, editTaxContainer, savedTaxName, savedTaxRate, taxRate) {
    const taxName = editTaxContainer.querySelector('.taxName');
    
    if (taxName.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else if (taxPercent.textContent == "") {
        showToolTip(taxPercent, 'Tax Percent cannot be Empty');
    } else {
        const taxRateToUpdate = jsonData.TaxRates.find(tax => tax.TaxRateId == taxRate.TaxRateId);
        taxRateToUpdate.Rate = parseFloat(taxPercent.textContent);
        taxRateToUpdate.Name = taxName.textContent.trim();
        
        updateLocalStorage(slotManagerInstance.currentSlot);

        savedTaxName.textContent = 'Tax Name: ' + taxName.textContent;
        savedTaxRate.textContent = 'Tax Percent: ' + taxPercent.textContent + '%';

        editTaxContainer.replaceWith(savedTaxContainer);
    }
}

export { editTax }