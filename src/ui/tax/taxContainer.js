import { updateLocalStorage } from '../context.js';

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
        const defaultOptionTaxType = document.querySelector('.taxTypeDropdown p');
        const defaultOptionDisplayTax = document.querySelector('.displayTaxDropdown p');

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

    const taxTypeDropdown = createTaxTypeDropdown(jsonData);
    
    taxTypeContainer.appendChild(taxTypeTitle);
    taxTypeContainer.appendChild(taxTypeDropdown);

    return taxTypeContainer;
}

function createTaxTypeDropdown(jsonData) {
    const taxTypeDropdown = document.createElement('div');
    taxTypeDropdown.className = 'taxTypeDropdown';

    const defaultOption = document.createElement('p');

    // Set default option based on jsonData.TaxType
    defaultOption.textContent = (jsonData.TaxType == 1) ? 'Excluded' : 'Included';

    const dropdownOptions = document.createElement('div');
    dropdownOptions.className = 'dropdownOptions';
    dropdownOptions.style.display = 'none';

    const excludedOption = createDropdownOption('Excluded');
    const includedOption = createDropdownOption('Included');

    dropdownOptions.appendChild(excludedOption);
    dropdownOptions.appendChild(includedOption);

    taxTypeDropdown.appendChild(defaultOption);
    taxTypeDropdown.appendChild(dropdownOptions);

    defaultOption.addEventListener('click', () => {
        dropdownOptions.style.display = (dropdownOptions.style.display === 'none') ? 'block' : 'none';
        defaultOption.textContent = ''; // Make the box empty when dropdown appears
    });

    excludedOption.addEventListener('click', () => {
        jsonData.TaxType = 0; // Update jsonData.TaxType
        defaultOption.textContent = 'Excluded';
        dropdownOptions.style.display = 'none';
    });

    includedOption.addEventListener('click', () => {
        jsonData.TaxType = 1; // Update jsonData.TaxType
        defaultOption.textContent = 'Included';
        dropdownOptions.style.display = 'none';
    });

    return taxTypeDropdown;
}

function createDisplayTaxContainer(jsonData) {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxContainer';

    const displayTaxTitle = document.createElement('p');
    displayTaxTitle.className = 'displayTaxTitle';
    displayTaxTitle.textContent = 'Display Tax';

    const displayTaxDropdown = createDisplayTaxDropdown(jsonData);

    displayTaxContainer.appendChild(displayTaxTitle);
    displayTaxContainer.appendChild(displayTaxDropdown);

    return displayTaxContainer;
}

function createDisplayTaxDropdown(jsonData) {
    const displayTaxDropdown = document.createElement('div');
    displayTaxDropdown.className = 'displayTaxDropdown';

    const defaultOption = document.createElement('p');

    // Set default option based on jsonData.DisplayTax
    defaultOption.textContent = (jsonData.DisplayTax == true) ? 'True' : 'False';

    const dropdownOptions = document.createElement('div');
    dropdownOptions.className = 'dropdownOptions';
    dropdownOptions.style.display = 'none';

    const trueOption = createDropdownOption('True');
    const falseOption = createDropdownOption('False');

    dropdownOptions.appendChild(trueOption);
    dropdownOptions.appendChild(falseOption);

    displayTaxDropdown.appendChild(defaultOption);
    displayTaxDropdown.appendChild(dropdownOptions);

    defaultOption.addEventListener('click', () => {
        dropdownOptions.style.display = (dropdownOptions.style.display === 'none') ? 'block' : 'none';
        defaultOption.textContent = ''; // Make the box empty when dropdown appears
    });

    trueOption.addEventListener('click', () => {
        jsonData.DisplayTax = true; // Update jsonData.DisplayTax
        defaultOption.textContent = 'True';
        dropdownOptions.style.display = 'none';
    });

    falseOption.addEventListener('click', () => {
        jsonData.DisplayTax = false; // Update jsonData.DisplayTax
        defaultOption.textContent = 'False';
        dropdownOptions.style.display = 'none';
    });

    return displayTaxDropdown;
}

function createDropdownOption(taxTypeValue) {
    const taxType = document.createElement('p');
    taxType.textContent = taxTypeValue;

    return taxType;
}

function createAddTaxContainer() {
    const addTaxContainer = document.createElement('div');
    addTaxContainer.className = 'addTaxContainer';

    const addTaxButton = document.createElement('button');
    addTaxButton.className = 'addTaxButton';
    addTaxButton.textContent = 'Add Tax';

    addTaxContainer.appendChild(addTaxButton);

    return addTaxContainer
}

export { createTaxContainer }