import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;
//let idCounter = 0;



function setJsonData(data) {
    jsonData = data
}

//Gets Section Index
function getSectionIndex(sectionId) {
    const sectionIndex = jsonData.MenuSections.findIndex(sectionElement => sectionElement.MenuSectionId == sectionId)

    return sectionIndex
}

//Updates JSON LocalStorage
function updateSectionLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

//Updates id LocalStorage
function updateCounterLocalStorage(id, addID) {
    if(addID)
    {
        let existingIDs = JSON.parse(localStorage.getItem("sectionIDs")); //array
        existingIDs.push(id);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
    }else{
        //console.log("ID a eliminar: " + id + " / " + "Type: " + typeof(id));
        let existingIDs = JSON.parse(localStorage.getItem("sectionIDs")); //array
        //console.log("IDs: " + existingIDs);
        const indexID = existingIDs.indexOf(Number(id));
        //console.log("Index del id: " + indexID);
        existingIDs.splice(indexID, 1);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
        //console.log("ids finales: " + existingIDs);
    }
    
}

export {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setJsonData,
    
}