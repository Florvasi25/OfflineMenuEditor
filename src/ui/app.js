function uploadFile() {
    console.log("Hola")
    const fileInput = document.getElementById("jsonFile");
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        fetch(selectedFile.path)
            .then(response => response.json())
            .then(data => {
                printSections(data)
            })
            .catch(error => {
                console.error("Error:", error);
            });
    } else {
        alert("Please select a JSON file to upload.");
    }
}

function printSections(data) {
    const menuSections = data.MenuSections;
    const sections = document.getElementById('ulSecciones');
    sections.innerHTML = ""

    menuSections.forEach(menuSection => {
        const name = menuSection.Name;
        sections.insertAdjacentHTML('beforeend', `<li class="liSecciones">${name}</li>`);
    });
}