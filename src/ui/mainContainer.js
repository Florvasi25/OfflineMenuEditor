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
    slotTitle.innerText = "Slot 1";

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
