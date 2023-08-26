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

function getDragAfterElement(outputContainer, y) {
    const draggableElements = [...outputContainer.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element 
}

let draggable = null;

outputContainer.addEventListener('dragenter', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(outputContainer, e.clientY)
    draggable = document.querySelector('.dragging')
    if (afterElement == null) {
        outputContainer.appendChild(draggable)
    } else {
        outputContainer.insertBefore(draggable, afterElement)
    }
})


outputContainer.addEventListener("dragend", () => {
    const rows = Array.from(outputContainer.querySelectorAll("tr"));
    const sectionid = draggable.getAttribute("id");
    const index = getSectionIndex(sectionid); 
    const indexNewPosition = rows.indexOf(draggable);

    if(index !== indexNewPosition) {
        const sectionToMove = jsonData.MenuSections.splice(index, 1)[0];
        jsonData.MenuSections.splice(indexNewPosition, 0, sectionToMove);
        jsonData.MenuSections.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });
        updateSectionLocalStorage()
    }
})

//After loading the Data it generates the HTML
generateHTML(jsonData);
createBtnContainers()

export { generateHTML }