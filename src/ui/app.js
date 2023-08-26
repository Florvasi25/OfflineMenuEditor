import {
    createSection,
} from "./section.js";

import {
    createSectionButton,
} from './addSectionButton.js'

import {
    createLoadJsonButton,
    createSaveButton,
} from './file.js'

import {
    jsonData,
    updateSectionLocalStorage,
    getSectionIndex,
} from './context.js';


//Builds HTML
function generateHTML(jsonData) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';
    
    jsonData.MenuSections.forEach(menuSection => {
        let sectionRow = createSection(menuSection);
        outputContainer.appendChild(sectionRow);
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