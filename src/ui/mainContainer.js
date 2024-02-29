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

//import { setFindBarEventListeners } from './findBar/findBar.js'

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

function handleExpandAll() {
    const sectionRow = document.querySelectorAll('.sectionRow');
    sectionRow.forEach(section => {
        if (section.classList.contains('folded')) {
            toggleSectionState(section);
        }
        const itemRow = section.nextElementSibling.querySelectorAll('.itemRow');
        if (itemRow) {
            itemRow.forEach(item => {
                if (item.classList.contains('folded')) {
                    toggleItemState(item, section.id);
                }
                const osRowHeader = item.nextElementSibling.querySelectorAll('.osRowHeader');
                if (osRowHeader) {
                    osRowHeader.forEach(os => {
                        if (os.classList.contains('folded')) {
                            toggleOsState(os, section.id, item.id);
                        }
                    });
                }
            });
        }
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

function createZoomInZoomOutButtonsCell (){
    const zoomInZoomOutButtonsContainer = document.createElement('div')
    zoomInZoomOutButtonsContainer.className = 'zoomInZoomOutButtonsContainer'

    // Create buttons
    const increaseBtn = document.createElement('button');
    increaseBtn.classList.add('increaseBtn');
    increaseBtn.classList.add('sectionButton');

    const zoomInButtonImg = document.createElement('img')
    zoomInButtonImg.classList.add('sectionButtonImg')
    zoomInButtonImg.src = '../../assets/zoomInIcon.svg'
    increaseBtn.appendChild(zoomInButtonImg)

    increaseBtn.onclick = function() {
        increaseFontSize(this);
    };

    const decreaseBtn = document.createElement('button');
    decreaseBtn.classList.add('decreaseBtn');
    decreaseBtn.classList.add('sectionButton');
    decreaseBtn.disabled = true;

    const zoomOutButtonImg = document.createElement('img')
    zoomOutButtonImg.classList.add('sectionButtonImg')
    zoomOutButtonImg.src = '../../assets/zoomOutIcon.svg'
    decreaseBtn.appendChild(zoomOutButtonImg)

    decreaseBtn.onclick = function() {
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

    slotTitle.addEventListener('keypress', function(event) {
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
        slotTitle.classList.remove('sectionClicked')
        slotTitle.style.color = 'white'
    });

    slotTitle.addEventListener('click', () => {
        slotTitle.classList.add('sectionClicked')
        slotTitle.style.color = 'black'
    })

    return slotTitle;
}

const slotManagerInstance = new SlotManager();
const findBarInstance = new FindBar();
//setFindBarEventListeners(findBarInstance);
generateHTML(jsonData);
createTaxContainer(jsonData)

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      findBarInstance.show();
    }
  });

export {
    generateHTML,
    createBtnContainers,
    createLeftContainer,
    createTaxContainer,
    slotManagerInstance,
    findBarInstance
}