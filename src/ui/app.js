import { saveToFile } from './file.js';

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? {};

document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        jsonData = JSON.parse(e.target.result);
        localStorage.setItem("jsonData", JSON.stringify(jsonData));
        generateHTML(jsonData);
    };

    reader.readAsText(file);
});

function generateHTML(data) {
    const outputContainer = document.getElementById('outputContainer');

    outputContainer.innerHTML = '';

    data.MenuSections.forEach(menuSection => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('mainSection');
        sectionDiv.id = menuSection.MenuSectionId;

        if (!menuSection.IsAvailable) {
            sectionDiv.classList.add('unavailable');
        }

        const nameParagraph = document.createElement('p');
        nameParagraph.contentEditable = true;
        nameParagraph.classList.add('name');
        nameParagraph.textContent = menuSection.Name;
        sectionDiv.appendChild(nameParagraph);

        nameParagraph.addEventListener('input', function () {
            updateDataFromUI();
        });

        outputContainer.appendChild(sectionDiv);
    });
}

function updateDataFromUI() {
    const menuSections = document.getElementsByClassName('mainSection');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = jsonData.MenuSections.findIndex(sectionIndex => sectionIndex.MenuSectionId == sectionId);

        const name = section.getElementsByClassName('name')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = name;
    });

    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

document.getElementById('saveButton').addEventListener('click', function () {
    updateDataFromUI();
    
    console.log(jsonData);
    saveToFile(jsonData);
});

// Call generateHTML when the page loads
generateHTML(jsonData);

