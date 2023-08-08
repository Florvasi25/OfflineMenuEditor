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
        let sectionDiv = createSection(menuSection)

        outputContainer.appendChild(sectionDiv);
    });
}

function createSection(menuSection){
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('sectionContainer');
    sectionDiv.id = menuSection.MenuSectionId;

    if (!menuSection.IsAvailable) {
        sectionDiv.classList.add('unavailable');
    }

    const sectionName = document.createElement('p');
    sectionName.contentEditable = true;
    sectionName.classList.add('sectionName');
    sectionName.textContent = menuSection.Name;
    sectionDiv.appendChild(sectionName);

    sectionName.addEventListener('input', updateDataFromUI);

    return sectionDiv
    // outputContainer.appendChild(sectionDiv);
}

function updateDataFromUI() {
    const menuSections = document.getElementsByClassName('sectionContainer');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = jsonData.MenuSections.findIndex(sectionIndex => sectionIndex.MenuSectionId == sectionId);

        const name = section.getElementsByClassName('sectionName')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = name;
    });

    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

document.getElementById('saveButton').addEventListener('click', function () {
    updateDataFromUI();
    
    console.log(jsonData);
    saveToFile(jsonData);
});

document.getElementById('addSectionButton').addEventListener('click', () => {

    const emptySectionJson = {
            MenuSectionId: 1,
            Name: "EMPTY",
            Description: null,
            DisplayOrder: 0,
            MenuItems: [],
            PublicId: "167876d3-b8ae-467e-ab8e-8a0dfda2b08e",
            IsDeleted: false,
            IsAvailable: false,
            IsHiddenFromUsers: true,
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 0,
            CellLayoutType: 0,
            MenuSectionAvailability: {
                MenuSectionId: 129293,
                AvailableTimes: null,
                AvailabilityMode: 0
            },
            ConcessionStoreId: null,
            MenuSectionMetadata: []
        };

    let sectionDiv = createSection(emptySectionJson)
    document.getElementById('outputContainer').appendChild(sectionDiv);
    jsonData.MenuSections.push(emptySectionJson)
    localStorage.setItem("jsonData", JSON.stringify(jsonData));

});

generateHTML(jsonData);

