import { saveToFile } from './file.js';

let jsonData = {};

document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        jsonData = JSON.parse(e.target.result);
        generateHTML(jsonData);
    };

    reader.readAsText(file);
});

function generateHTML(data) {
    const outputContainer = document.getElementById('outputContainer');

    outputContainer.innerHTML = '';

    data.MenuSections.forEach(menuSection => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('menu');
        sectionDiv.id = menuSection.MenuSectionId;
        sectionDiv.innerHTML = `
            <p contenteditable="true" class="name">${menuSection.Name}</p>
            <p contenteditable="true" class="IsAvailable">${menuSection.IsAvailable}</p>
        `;
        outputContainer.appendChild(sectionDiv);
    });
    localStorage.setItem("jsonData", JSON.stringify(jsonData.MenuSections));
}

document.getElementById('saveButton').addEventListener('click', function () {
    const menuSections = document.getElementsByClassName('menu');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = jsonData.MenuSections.findIndex(sectionIndex => sectionIndex.MenuSectionId == sectionId);

        const name = section.getElementsByClassName('name')[0].textContent;
        const isAvailable = section.getElementsByClassName('IsAvailable')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = name
        jsonData.MenuSections[sectionIndex].IsAvailable = isAvailable
    });

    console.log(jsonData);
    saveToFile(jsonData)
});
