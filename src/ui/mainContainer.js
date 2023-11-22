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
    const loadJsonButton = createLoadJsonButton()
    const saveButton = createSaveButton()

    const loadAllButton = document.createElement('button')
    loadAllButton.textContent = 'Expand/Close'
    loadAllButton.className = 'loadAllButton'
    loadAllButton.addEventListener('click', () => {
        changeClasses()
    })

    fileOptionsContainer.appendChild(loadJsonButton)
    fileOptionsContainer.appendChild(saveButton)
    fileOptionsContainer.appendChild(loadAllButton)
    
    const newSectionBtnContainer = document.getElementById('newSectionBtnContainer')
    const newSectionButton = createSectionButton()
    newSectionBtnContainer.appendChild(newSectionButton)
}

function changeClasses() {
    const sectionRow = document.querySelectorAll('.sectionRow');
    sectionRow.forEach(section => {
        toggleSectionState(section);

        const nextSibling = section.nextElementSibling;
        if (nextSibling) {
            const itemRow = nextSibling.querySelectorAll('.itemRow');
            itemRow.forEach(item => {
                toggleItemState(item, section.id);

                const osRowHeader = item.nextElementSibling.querySelectorAll('.osRowHeader');
                if (osRowHeader) {
                    osRowHeader.forEach(os => {
                        toggleOsState(os, section.id, item.id);
                    });
                }
            });
        }
    });
}

//After loading the Data it generates the HTML
generateHTML(jsonData);
createBtnContainers()

export { generateHTML }