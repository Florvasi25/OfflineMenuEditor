function createTaxContainer(jsonData) {
    const taxContainer = document.getElementById('taxContainer');
    taxContainer.innerHTML = '';
    taxContainer.className = 'taxContainer';

    const taxHeaderContainer = createTaxHeaderContainer()
    
    const taxTypeContainer = createTaxTypeContainer(jsonData)

    const displayTaxContainer = createDisplayTaxContainer()

    const addTaxContainer = createAddTaxContainer()

    taxContainer.appendChild(taxHeaderContainer);
    taxContainer.appendChild(taxTypeContainer);
    taxContainer.appendChild(displayTaxContainer);
    taxContainer.appendChild(addTaxContainer);

    return taxContainer
}

function createTaxHeaderContainer() {
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

function createDropdownOption(taxTypeValue) {
    const taxType = document.createElement('p');
    taxType.textContent = taxTypeValue;

    return taxType;
}

function createDisplayTaxContainer() {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxContainer';

    const displayTaxTitle = document.createElement('p');
    displayTaxTitle.className = 'displayTaxTitle';
    displayTaxTitle.textContent = 'Display Tax';

    displayTaxContainer.appendChild(displayTaxTitle);

    return displayTaxContainer
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