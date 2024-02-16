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

    fileOptionsContainer.appendChild(loadJsonButton)
    fileOptionsContainer.appendChild(saveButton)
    fileOptionsContainer.appendChild(expandAllButton)
    fileOptionsContainer.appendChild(closeAllButton)
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
generateHTML(jsonData);
createTaxContainer(jsonData)

export {
    generateHTML,
    createBtnContainers,
    createLeftContainer,
    createTaxContainer,
    slotManagerInstance
}