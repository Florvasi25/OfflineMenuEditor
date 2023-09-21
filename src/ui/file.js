import {
    jsonData, 
    setJsonData,
    updateSectionLocalStorage,
    setSectionId,
    setItemId,
    setSectionDisplayOrder,
} from './context.js';

import {
    generateHTML,
 } from './main.js'

function createLoadJsonButton() {
    const loadJsonButton = document.createElement('input')
    loadJsonButton.setAttribute('id', 'jsonFileInput')
    loadJsonButton.setAttribute('accept', '.json, .txt')
    loadJsonButton.setAttribute('type', 'file')

    loadJsonButton.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function (e) {
            setJsonData(JSON.parse(e.target.result));
            updateSectionLocalStorage()
            setSectionId(jsonData);
            setSectionDisplayOrder(jsonData);
            setItemId(jsonData);
            generateHTML(jsonData);
        };
    
        if (!file) return
        reader.readAsText(file);
    });

    return loadJsonButton
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

export { saveToFile, createSaveButton, createLoadJsonButton }
