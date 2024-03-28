import {
    createLoadJsonButton,
    createSaveButton,
} from './file.js'

import { createSection } from "./section/sectionContainer.js";

import { createSectionButton } from './section/sectionAddNew.js'

import { jsonData } from './context.js';

import { toggleSectionState } from './section/sectionDropDown.js'

import { toggleItemState } from './item/itemDropDown.js'

import { toggleOsState } from './optionSet/osDropDown.js';

import { createLeftContainer } from './slots/slotsContainer.js'

import { SlotManager } from './slots/slotManager.js'

import { createTaxContainer } from './tax/taxContainer.js';

import { FindBar } from './findBar/findBar.js'

//Builds HTML
function generateHTML(jsonData) {
    const sectionContainer = document.getElementById('sectionContainer');
    sectionContainer.innerHTML = '';

    jsonData.MenuSections.forEach(menuSection => {
        let sectionRow = createSection(menuSection);
        sectionContainer.appendChild(sectionRow);
    });
}

function createBtnContainers() {
    const fileOptionsContainer = document.getElementById('fileOptionsContainer')
    
    const slotTitle = createSlotTitle();
    slotTitle.id = 'slotButton1';

    const loadJsonButton = createLoadJsonButton()
    const saveButton = createSaveButton()

    const expandAllButton = createExpandAllButton()
    const closeAllButton = createCloseAllButton()

    const zoomInzoomOutButtons = createZoomInZoomOutButtonsCell()

    fileOptionsContainer.appendChild(loadJsonButton)
    fileOptionsContainer.appendChild(saveButton)
    fileOptionsContainer.appendChild(expandAllButton)
    fileOptionsContainer.appendChild(closeAllButton)
    fileOptionsContainer.appendChild(zoomInzoomOutButtons)
    fileOptionsContainer.appendChild(slotTitle)

    const newSectionBtnContainer = document.getElementById('newSectionBtnContainer')
    const newSectionButton = createSectionButton()
    newSectionBtnContainer.appendChild(newSectionButton)
}

function createExpandAllButton() {
    const expandAllButton = document.createElement('button')
    expandAllButton.textContent = 'Expand All'
    expandAllButton.className = 'expandAllButton'
    expandAllButton.addEventListener('click', () => {
        handleExpandAll()
    })

    return expandAllButton
}

async function handleExpandAll() {
    // Show loading indicator
    showLoadingIndicator();

    // Introduce a small delay (e.g., 100 milliseconds) before executing asynchronous operations
    await delay(100);

    await expandAllSections();
    await expandAllItemRows();
    await expandAllOsRowHeaders();

    // Hide loading indicator
    hideLoadingIndicator();
}

// Function to introduce a delay using Promises
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showLoadingIndicator() {
    // Create a loading element
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Check if the loading element already exists
    let loadingElement = document.getElementById('loadingElement');
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'loadingElement';
        loadingElement.textContent = 'LOADING...'; // You can customize the loading text/style
        loadingElement.style.display = 'flex';
        loadingIndicator.appendChild(loadingElement);
    }
}

function hideLoadingIndicator() {
    // Hide loading element
    const loadingElement = document.getElementById('loadingElement');
    if (loadingElement) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}


// Rest of your code remains unchanged...

async function expandAllSections() {
    const sectionRows = document.querySelectorAll('.sectionRow');
    for (const section of sectionRows) {
        if (section.classList.contains('folded')) {
            await toggleSectionState(section);
        }
    }
}

async function expandAllItemRows() {
    const itemRows = document.querySelectorAll('.itemRow');
    for (const itemRow of itemRows) {
        if (itemRow.classList.contains('folded')) {
            const itemTable = itemRow.parentElement.parentElement;
            const sectionId = itemTable.previousElementSibling.id;
            await toggleItemState(itemRow, sectionId);
        }
    }
}

async function expandAllOsRowHeaders() {
    const sizeInBytes = measureJsonSize(jsonData);

    if (sizeInBytes > 1500000) {
        // console.log('lazy');
        await setupLazyLoading();
    } else {
        // console.log('all');
        const osRowHeaders = document.querySelectorAll('.osRowHeader');
        for (const osRowHeader of osRowHeaders) {
            if (osRowHeader.classList.contains('folded')) {
                const osTable = osRowHeader.parentElement.parentElement.parentElement.parentElement;
                const itemRow = osTable.previousElementSibling;
                const sectionRow = itemRow.parentElement.parentElement.previousElementSibling;
                await toggleOsState(osRowHeader, sectionRow.id, itemRow.id);
            }
        }
    }
}


// Function to check if lazy loading should be activated based on JSON size
function measureJsonSize(jsonData) {
    const jsonString = JSON.stringify(jsonData);
    const sizeInBytes = new Blob([jsonString]).size;
    // console.log(`JSON size: ${sizeInBytes} bytes`);
    return sizeInBytes;
}

function setupLazyLoading() {
    const osRowHeaders = document.querySelectorAll('.osRowHeader');
    
    const observerOptions = {
        root: null, // Use the viewport as the root
        threshold: 0.1 // Trigger when 50% of the element is in the viewport
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const osRowHeader = entry.target;
                if (osRowHeader.classList.contains('folded')) {
                    const osTable = osRowHeader.parentElement.parentElement.parentElement.parentElement;
                    const itemRow = osTable.previousElementSibling;
                    const sectionRow = itemRow.parentElement.parentElement.previousElementSibling;
                    toggleOsState(osRowHeader, sectionRow.id, itemRow.id);
                    observer.unobserve(osRowHeader); // Unobserve after toggling
                }
            }
        });
    }, observerOptions);

    osRowHeaders.forEach(osRowHeader => {
        observer.observe(osRowHeader);
    });
}

function createCloseAllButton() {
    const closeAllButton = document.createElement('button')
    closeAllButton.textContent = 'Close All'
    closeAllButton.className = 'closeAllButton'
    closeAllButton.addEventListener('click', () => {
        handleCloseAll()
    })

    return closeAllButton
}

function handleCloseAll() {
    const sectionRow = document.querySelectorAll('.sectionRow');
    sectionRow.forEach(section => {
        if (section.classList.contains('expanded')) {
            toggleSectionState(section);
        }
    });
}

let clickCount = 0; // Track the total number of clicks

function createZoomInZoomOutButtonsCell() {
    const zoomInZoomOutButtonsContainer = document.createElement('div')
    zoomInZoomOutButtonsContainer.className = 'zoomInZoomOutButtonsContainer'

    // Create buttons
    const increaseBtn = document.createElement('button');
    increaseBtn.classList.add('increaseBtn');
    increaseBtn.classList.add('sectionButton');

    const zoomInButtonImg = document.createElement('img')
    zoomInButtonImg.classList.add('zoomButtonImg')
    zoomInButtonImg.src = '../../assets/zoomInIcon.svg'
    increaseBtn.appendChild(zoomInButtonImg)

    increaseBtn.onclick = function () {
        increaseFontSize(this);
    };

    const decreaseBtn = document.createElement('button');
    decreaseBtn.classList.add('decreaseBtn');
    decreaseBtn.classList.add('sectionButton');
    decreaseBtn.disabled = true;

    const zoomOutButtonImg = document.createElement('img')
    zoomOutButtonImg.classList.add('zoomButtonImg')
    zoomOutButtonImg.src = '../../assets/zoomOutIcon.svg'
    decreaseBtn.appendChild(zoomOutButtonImg)

    decreaseBtn.onclick = function () {
        decreaseFontSize(this);
    };

    zoomInZoomOutButtonsContainer.appendChild(increaseBtn);
    zoomInZoomOutButtonsContainer.appendChild(decreaseBtn);

    return zoomInZoomOutButtonsContainer
}

function increaseFontSize(button) {
    let paragraphs = document.querySelectorAll('p'); // Select all <p> elements
    if (clickCount < 2) { // Check if maximum limit of 2 clicks is not reached
        paragraphs.forEach(paragraph => {
            let currentFontSize = parseInt(window.getComputedStyle(paragraph).fontSize); // Get the current font size
            currentFontSize++;
            paragraph.style.fontSize = currentFontSize + 'px';
        });
        clickCount++;
        button.nextElementSibling.disabled = false; // Enable decrease button
    }
    if (clickCount === 2) { // Disable "+" button when maximum limit is reached
        button.disabled = true;
    }
}

function decreaseFontSize(button) {
    const increaseBtn = document.querySelector('.increaseBtn');
    let paragraphs = document.querySelectorAll('p'); // Select all <p> elements
    if (clickCount > 0) { // Check if current font size is greater than the minimum
        paragraphs.forEach(paragraph => {
            let currentFontSize = parseInt(window.getComputedStyle(paragraph).fontSize); // Get the current font size
            currentFontSize--;
            paragraph.style.fontSize = currentFontSize + 'px';
        });
        clickCount--;
        button.disabled = clickCount === 0; // Disable "-" button when minimum limit is reached
        increaseBtn.disabled = false; // Re-enable "+" button
    }
}

function createSlotTitle() {
    var slotTitle = document.createElement("div");
    slotTitle.className = 'slotTitle'
    const buttonId = 'slotButton1';
    slotTitle.id = buttonId;

    const localStorageText = localStorage.getItem(buttonId);
    if (localStorageText) {
        slotTitle.textContent = localStorageText;
    } else {
        slotTitle.textContent = "Slot 1";
    }

    slotTitle.setAttribute('contenteditable', 'true');

    slotTitle.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const buttonId = slotTitle.id;

            const slotButton = document.getElementById(buttonId);
            slotButton.textContent = slotTitle.textContent;
            localStorage.setItem(buttonId, slotButton.textContent);

            slotTitle.textContent = localStorage.getItem(buttonId);
            slotTitle.blur()
        }
    });

    slotTitle.addEventListener('blur', () => {
        const buttonId = slotTitle.id;

        slotTitle.textContent = localStorage.getItem(buttonId)
        slotTitle.style.color = 'white'
    });

    slotTitle.addEventListener('click', () => {
        slotTitle.style.color = 'black'
    })

    return slotTitle;
}

const slotManagerInstance = new SlotManager();
const findBarInstance = new FindBar();

generateHTML(jsonData);
createTaxContainer(jsonData)

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        findBarInstance.show();
    }
});

function scrollUpButton() {
    const scrollUp = document.getElementById('scrollUp')

    const scrollUpButton = document.createElement('button');
    scrollUpButton.className = 'scrollUpButton'

    const scrollUpButtonImg = document.createElement('img')
    scrollUpButtonImg.className = 'scrollUpButtonImg'
    scrollUpButtonImg.src = '../../assets/upwardIcon.svg'

    scrollUpButton.appendChild(scrollUpButtonImg)

    scrollUpButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollUp.appendChild(scrollUpButton);

    return scrollUp;
}

export {
    generateHTML,
    createBtnContainers,
    createLeftContainer,
    createTaxContainer,
    slotManagerInstance,
    findBarInstance,
    clickCount,
    scrollUpButton
}