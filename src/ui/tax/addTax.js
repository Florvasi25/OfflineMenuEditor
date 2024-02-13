import { 
    updateLocalStorage,
    getRandomInt,
    jsonData
} from '../context.js';

import { showToolTip } from '../toolTip.js';

import { slotManagerInstance } from '../mainContainer.js';

import { createSavedTax } from './savedTax.js'

function createAddTaxContainer(jsonData) {
    const addTaxContainer = document.createElement('div');
    addTaxContainer.className = 'addTaxContainer';

    const addTaxButton = document.createElement('button');
    addTaxButton.classList.add('addTaxButton');
    addTaxButton.classList.add('taxButton');
    addTaxButton.textContent = 'Add Tax';

    addTaxContainer.appendChild(addTaxButton);

    addTaxButton.addEventListener('click', () => {
        createNewTaxContainer(addTaxContainer, jsonData)    
    });

    return addTaxContainer;
}

function createNewTaxContainer(addTaxContainer, jsonData) {
    const newTaxContainer = document.createElement('div');
    newTaxContainer.className = 'newTaxContainer';

    const taxNameContainer = document.createElement('div');
    taxNameContainer.className = 'taxNameContainer';

    const taxNameTitle = document.createElement('p');
    taxNameTitle.className = 'taxNameTitle';
    taxNameTitle.textContent = 'Tax Name';

    const taxName = document.createElement('p')
    taxName.contentEditable = true
    taxName.className = 'taxName'
    taxName.textContent = 'Tax ' + (jsonData.TaxRates.length + 1);

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

    let previousRateValue

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

    let previoustaxName

    taxName.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxName.textContent;
            previoustaxName = enteredValue; 
            taxName.blur()
        }
    });
    
    taxName.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxName.textContent = previoustaxName;
        }
    });

    const saveTaxButton = document.createElement('button');
    saveTaxButton.classList.add('saveTaxButton');
    saveTaxButton.classList.add('taxButton')
    saveTaxButton.textContent = 'Save Tax';
    
    saveTaxButton.addEventListener('click', () => {
        handleSaveTax(newTaxContainer, addTaxContainer, taxPercent, taxName)
    });
    
    taxPercentContainer.appendChild(taxPercentTitle);
    taxPercentContainer.appendChild(taxPercent);
    taxPercentContainer.appendChild(saveTaxButton);
    
    newTaxContainer.appendChild(taxNameContainer);
    newTaxContainer.appendChild(taxPercentContainer);
    
    addTaxContainer.parentNode.insertBefore(newTaxContainer, addTaxContainer);
}

function handleSaveTax(newTaxContainer, addTaxContainer, taxPercent, taxName) {
    if (taxName.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else if (taxPercent.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else {
        const newTaxRate = {
            TaxRateId: getRandomInt(),
            MenuId: jsonData.MenuId,
            Name: taxName.textContent,
            Rate: Number(taxPercent.textContent)
        }

        jsonData.TaxRates.push(newTaxRate);
        console.log('new Tax added');

        updateLocalStorage(slotManagerInstance.currentSlot);

        newTaxContainer.remove()
        const savedTax = createSavedTax(newTaxRate)

        addTaxContainer.parentNode.insertBefore(savedTax, addTaxContainer);
    }
}

export { createAddTaxContainer }