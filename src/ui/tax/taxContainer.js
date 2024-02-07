import { updateLocalStorage } from '../context.js';

import { showToolTip } from '../toolTip.js';

function createTaxContainer(jsonData) {
    const taxContainer = document.getElementById('taxContainer');
    taxContainer.innerHTML = '';
    taxContainer.className = 'taxContainer';

    const taxHeaderContainer = createTaxHeaderContainer(jsonData)
    
    const taxTypeContainer = createTaxTypeContainer(jsonData)

    const displayTaxContainer = createDisplayTaxContainer(jsonData)

    const addTaxContainer = createAddTaxContainer()

    taxContainer.appendChild(taxHeaderContainer);
    taxContainer.appendChild(taxTypeContainer);
    taxContainer.appendChild(displayTaxContainer);
    taxContainer.appendChild(addTaxContainer);

    return taxContainer
}

function createTaxHeaderContainer(jsonData) {
    const taxHeaderContainer = document.createElement('div');
    taxHeaderContainer.className = 'taxHeaderContainer';

    const taxHeaderTitle = document.createElement('p');
    taxHeaderTitle.className = 'taxHeaderTitle';
    taxHeaderTitle.textContent = 'Tax Rates';

    const saveTaxButton = document.createElement('button');
    saveTaxButton.className = 'saveTaxButton';
    saveTaxButton.textContent = 'Save Tax';

    taxHeaderContainer.appendChild(taxHeaderTitle);
    taxHeaderContainer.appendChild(saveTaxButton);
    
    saveTaxButton.addEventListener('click', () => {
        const defaultOptionTaxType = document.querySelector('.taxTypeCheckboxes p');
        const defaultOptionDisplayTax = document.querySelector('.displayTaxCheckboxes p');

        if (defaultOptionTaxType.textContent === 'Excluded') {
            jsonData.TaxType = 1;
            console.log('TaxType: 1');
            jsonData.DisplayTax = true;
            console.log('DisplayTax: true');
        } else if (defaultOptionTaxType.textContent === 'Included') {
            jsonData.TaxType = 0;
            console.log('TaxType: 0');
        }

        defaultOptionDisplayTax.textContent = jsonData.DisplayTax ? 'True' : 'False';

        updateLocalStorage();
    });

    return taxHeaderContainer
}

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

            console.log(trueCheckbox);
            updateLocalStorage()
        }
    });

    includedCheckbox.addEventListener('change', () => {
        if (includedCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.TaxType = 0; // Update jsonData.TaxType
            excludedCheckbox.querySelector('input[type="checkbox"]').checked = false;
            updateLocalStorage()
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

function createDisplayTaxContainer(jsonData) {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxContainer';

    const displayTaxTitle = document.createElement('p');
    displayTaxTitle.className = 'displayTaxTitle';
    displayTaxTitle.textContent = 'Display Tax';

    const displayTaxCheckboxes = createDisplayTaxCheckboxes(jsonData);

    displayTaxContainer.appendChild(displayTaxTitle);
    displayTaxContainer.appendChild(displayTaxCheckboxes);

    return displayTaxContainer;
}

function createDisplayTaxCheckboxes(jsonData) {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxCheckboxes';

    const trueCheckbox = displayTaxCheckbox('True', jsonData.DisplayTax === true);
    trueCheckbox.classList.add('trueCheckbox')
    const falseCheckbox = displayTaxCheckbox('False', jsonData.DisplayTax !== true);
    falseCheckbox.classList.add('falseCheckbox')

    displayTaxContainer.appendChild(trueCheckbox);
    displayTaxContainer.appendChild(falseCheckbox);

    trueCheckbox.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        if (trueCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.DisplayTax = true; // Update jsonData.DisplayTax
            falseCheckbox.querySelector('input[type="checkbox"]').checked = false;
            updateLocalStorage()
        }
    });

    falseCheckbox.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        if (falseCheckbox.querySelector('input[type="checkbox"]')) {
            const excludedCheckbox = document.querySelector('.taxTypeCheckboxes .excludedCheckbox');
            
            if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                falseCheckbox.querySelector('input[type="checkbox"]').checked = false;
                showToolTip(falseCheckbox, 'Excluded Tax must always be True');
                console.log('Excluded');
            } else {
                jsonData.DisplayTax = false; // Update jsonData.DisplayTax
                trueCheckbox.querySelector('input[type="checkbox"]').checked = false;
                updateLocalStorage()
            }

        }
    });

    return displayTaxContainer;
}

function displayTaxCheckbox(displayTaxValue, checked) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkboxContainer');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const label = document.createElement('label');
    label.className = 'checkboxLabel';
    label.textContent = displayTaxValue;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

function createAddTaxContainer() {
    const addTaxContainer = document.createElement('div');
    addTaxContainer.className = 'addTaxContainer';

    const addTaxButton = document.createElement('button');
    addTaxButton.className = 'addTaxButton';
    addTaxButton.textContent = 'Add Tax';

    addTaxContainer.appendChild(addTaxButton);

    addTaxButton.addEventListener('click', () => {
        createNewTaxContainer(addTaxContainer)    
    });

    return addTaxContainer;
}

function createNewTaxContainer(addTaxContainer) {
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

    taxPercentContainer.appendChild(taxPercentTitle);
    taxPercentContainer.appendChild(taxPercent);

    newTaxContainer.appendChild(taxNameContainer);
    newTaxContainer.appendChild(taxPercentContainer);

    addTaxContainer.parentNode.insertBefore(newTaxContainer, addTaxContainer);
}

export { createTaxContainer }