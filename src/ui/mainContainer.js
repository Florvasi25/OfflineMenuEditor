import {
    createLoadJsonButton,
    createSaveButton,
} from './file.js'

import { createSection } from "./section/sectionContainer.js";

import { createSectionButton } from './section/sectionAddNew.js'

import { jsonData } from './context.js';

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
    fileOptionsContainer.appendChild(loadJsonButton)
    fileOptionsContainer.appendChild(saveButton)
    
    const newSectionBtnContainer = document.getElementById('newSectionBtnContainer')
    const newSectionButton = createSectionButton()
    newSectionBtnContainer.appendChild(newSectionButton)
}

//After loading the Data it generates the HTML
generateHTML(jsonData);
createBtnContainers()

export { generateHTML }