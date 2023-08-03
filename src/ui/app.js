// var jsonData = []

function uploadFile() {
    console.log("Hola")
    const fileInput = document.getElementById("jsonFile");
    const selectedFile = fileInput.files[0];
    
    if (selectedFile) {
        // fetch(selectedFile.path).then(response => jsonData = response.json())
        fetch(selectedFile.path)
            .then(response => response.json())
            .then(data => {
                createSections(data)
            })
            .catch(error => {
                console.error("Error:", error);
            });
    } else {
        alert("Please select a JSON file to upload.");
    }
}

function createSections(data) {
    const menuSections = data.MenuSections;
    const sections = document.getElementById('ulSections');
    sections.innerHTML = ""

    menuSections.forEach(menuSection => {
        const sectionName = menuSection.Name;
        const sectionId = menuSection.MenuSectionId;
        sections.insertAdjacentHTML('beforeend', 
            `<li class="liSections" id=${sectionId}>
                <p contenteditable="true">${sectionName}</p>
                <button id=${sectionId}>Delete</button>
            </li>`);
        
        });
    console.log(sections)
}