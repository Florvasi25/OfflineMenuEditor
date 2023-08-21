import { saveToFile } from './file.js';

import {
    createSection,
} from "./section.js";

import {
    jsonData, setJsonData,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setSectionId,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from './context.js';

//Loading the File
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        setJsonData(JSON.parse(e.target.result));
        updateSectionLocalStorage()
        setSectionId(jsonData);
        setSectionDisplayOrder(jsonData);
        generateHTML(jsonData);
    };

    if (!file) return
    reader.readAsText(file);
});

//Builds HTML
function generateHTML(jsonData) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';

    jsonData.MenuSections.forEach(menuSection => {
        let sectionRow = createSection(menuSection);
        outputContainer.appendChild(sectionRow);
    });
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

outputContainer.addEventListener("dragend", () => {
    // obtiene todas las filas
    const rows = Array.from(outputContainer.querySelectorAll("tr"));

    rows.forEach((row, index) => {

        const sectionID = row.getAttribute("id");
        setSectionDisplayOrder(jsonData, sectionID, index);
    }
    // encuentra el index y el id de la fila que movimos
    /*if(draggable)
    {
        const newPosition = rows.indexOf(draggable);
        const draggedRowId = draggable.getAttribute("id");
        console.log("Nuevo index:", newPosition);
        console.log("ID:", draggedRowId);
    }*/
)});

//Saves JSON
document.getElementById('saveButton').addEventListener('click', function () {
    console.log(jsonData);
    saveToFile(jsonData);
});

//Add Section
document.getElementById('addSectionButton').addEventListener('click', () => {
    const newId = getUniqueRandomInt()
    const displayOrder = outputContainer.querySelectorAll("tbody tr"); // gets the number of rows in the table.

    const emptySectionJson = {
        MenuSectionId: newId,
        Name: "Empty",
        Description: null,
        DisplayOrder: displayOrder.length,
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

    let sectionRow = createSection(emptySectionJson)

    document.getElementById('outputContainer').appendChild(sectionRow);

    jsonData.MenuSections.push(emptySectionJson)
    updateSectionLocalStorage()
    updateCounterLocalStorage(newId, true);

});

//After loading the Data it generates the HTML
generateHTML(jsonData);