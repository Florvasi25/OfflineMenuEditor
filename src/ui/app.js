import { saveToFile } from './file.js';

import {
    createSection,
} from "./section.js";

import {
    jsonData, setJsonData,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setSectionId,
    getUniqueRandomInt,
} from './context.js';

//Loading the File
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        setJsonData(JSON.parse(e.target.result));
        setSectionId(jsonData);
        generateHTML(jsonData);
        updateSectionLocalStorage()
    };

    if (!file) return
    reader.readAsText(file);
});

//Builds HTML
function generateHTML(data) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';
    data.MenuSections.sort((a, b) => a.DisplayOrder - b.DisplayOrder); //Sorts the Sections by DisplayOrder
    data.MenuSections.forEach(menuSection => {
        const sectionRow = createSection(menuSection);
        outputContainer.appendChild(sectionRow);
    });
}

outputContainer.addEventListener('dragenter', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(outputContainer, e.clientY)
    const draggable = document.querySelector('.dragging')
    console.log("hola");
    if (afterElement == null) {
        outputContainer.appendChild(draggable)
    } else {
        outputContainer.insertBefore(draggable, afterElement)
    }
})

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

//Saves JSON
document.getElementById('saveButton').addEventListener('click', function () {
    console.log(jsonData);
    saveToFile(jsonData);
});

//Add Section
document.getElementById('addSectionButton').addEventListener('click', () => {
    const newId = getUniqueRandomInt()

    const emptySectionJson = {
        MenuSectionId: newId,
        Name: "Empty",
        Description: null,
        DisplayOrder: jsonData.MenuSections.length,
        MenuItems: [],
        PublicId: crypto.randomUUID(),
        IsDeleted: false,
        IsAvailable: true,
        IsHiddenFromUsers: false,
        ImageName: null,
        ImageUrl: null,
        CellAspectRatio: 0,
        CellLayoutType: 0,
        MenuSectionAvailability: {
            MenuSectionId: newId,
            AvailableTimes: null,
            AvailabilityMode: 0
        },
        ConcessionStoreId: null,
        MenuSectionMetadata: []
    };

    const sectionRow = createSection(emptySectionJson)

    document.getElementById('outputContainer').appendChild(sectionRow);

    jsonData.MenuSections.push(emptySectionJson)
    updateSectionLocalStorage()
    updateCounterLocalStorage(newId, true);

});

//After loading the Data it generates the HTML
generateHTML(jsonData);
