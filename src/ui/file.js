import {
    jsonData,
    setJsonData,
    updateLocalStorage,
    setSectionId,
    setItemId,
    setSectionDisplayOrder,
    setOptionSetId,
    setOptionSetItemsId,
    closeOsModalContainer
} from './context.js';

import { generateHTML } from './mainContainer.js'

function createLoadJsonButton() {
    const loadJsonButton = document.createElement('button');
    loadJsonButton.setAttribute('id', 'loadJsonButton');
    loadJsonButton.textContent = 'Load JSON';

    const fileInput = document.createElement('input');
    fileInput.setAttribute('id', 'jsonFileInput');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', '.json, .txt');
    fileInput.style.display = 'none'; // Hide the file input initially

    const container = document.createElement('div');
    container.appendChild(loadJsonButton);
    container.appendChild(fileInput);

    loadJsonButton.addEventListener('click', function () {
        fileInput.click(); // Trigger file input when button is clicked
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                setJsonData(jsonData);
                updateLocalStorage();
                setSectionId(jsonData);
                setSectionDisplayOrder(jsonData);
                setItemId(jsonData);
                setOptionSetId(jsonData);
                setOptionSetItemsId(jsonData);
                generateHTML(jsonData);

                fileInput.value = ''; // Clear the file input
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        closeOsModalContainer()

        if (!file) return;
        reader.readAsText(file);
    });

    return container
}



function createSaveButton() {
    const saveButton = document.createElement('button')
    saveButton.setAttribute('id', 'saveButton')
    saveButton.textContent = 'Save Changes'

    saveButton.addEventListener('click', function () {
        console.log(jsonData);
        saveToFile(jsonData);
    });

    return saveButton
}

function saveToFile(data) {
    const updatedJsonData = JSON.stringify(data, null, 2); // Pretty-print JSON
    const blob = new Blob([updatedJsonData], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_data.json';
    a.textContent = 'Download Updated JSON';

    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);

    a.click(); // Programmatically trigger the click event

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export {
    saveToFile,
    createSaveButton,
    createLoadJsonButton
}
