function createTaxContainer() {
    const taxContainer = document.getElementById('taxContainer');
    taxContainer.className = 'taxContainer';

    const taxHeaderContainer = createTaxHeaderContainer()
    
    const taxTypeContainer = createTaxTypeContainer()

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

    taxHeaderContainer.appendChild(taxHeaderTitle);

    return taxHeaderContainer
}

function createTaxTypeContainer() {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeContainer';

    const taxTypeTitle = document.createElement('p');
    taxTypeTitle.className = 'taxTypeTitle';
    taxTypeTitle.textContent = 'Tax Type';

    const taxTypeDropdown = createTaxTypeDropdown();
    
    taxTypeContainer.appendChild(taxTypeTitle);
    taxTypeContainer.appendChild(taxTypeDropdown);

    return taxTypeContainer;
}

function createTaxTypeDropdown() {
    const taxTypeDropdown = document.createElement('div');
    taxTypeDropdown.className = 'taxTypeDropdown';

    const defaultOption = document.createElement('p');
    defaultOption.textContent = 'Excluded';

    const dropdownOptions = document.createElement('div');
    dropdownOptions.className = 'dropdownOptions';
    dropdownOptions.style.display = 'none';

    const excludedOption = createDropdownOption('Excluded', 'excluded');
    const includedOption = createDropdownOption('Included', 'included');

    dropdownOptions.appendChild(excludedOption);
    dropdownOptions.appendChild(includedOption);

    taxTypeDropdown.appendChild(defaultOption);
    taxTypeDropdown.appendChild(dropdownOptions);

    defaultOption.addEventListener('click', () => {
        dropdownOptions.style.display = (dropdownOptions.style.display === 'none') ? 'block' : 'none';
        defaultOption.textContent = ''; // Make the box empty when dropdown appears
    });

    excludedOption.addEventListener('click', () => {
        defaultOption.textContent = 'Excluded';
        dropdownOptions.style.display = 'none';
    });

    includedOption.addEventListener('click', () => {
        defaultOption.textContent = 'Included';
        dropdownOptions.style.display = 'none';
    });

    return taxTypeDropdown;
}

function createDropdownOption(text, value) {
    const option = document.createElement('p');
    option.textContent = text;
    option.value = value;

    return option;
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