import { 
    updateLocalStorage,
    groupedOs 
} from '../../context.js'

function createOsNameCell(menuOs, itemId, sectionId) {
    //Name Cell
    const osNameCell = document.createElement('div');
    osNameCell.classList.add('osNameCell');

    const osNameHeader = createOsName(menuOs, itemId, sectionId)
    osNameCell.appendChild(osNameHeader);
    
    return osNameCell
}

//Handles Name Edits
function createOsName(menuOs, itemId, sectionId) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOsName = osName.textContent;
            updateName(menuOs.groupOsId, newOsName);
            originalName = newOsName;
            osName.blur();
            const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader')); 
            const osNameHeader = osNameHeaderArray.filter((p) => p.id == menuOs.groupOsId)
            osNameHeader.forEach(os => {
                os.textContent = newOsName;
            })
        } else if (e.key === 'Escape') {
            osName.textContent = originalName;
            osName.blur();
        }
    });

    osName.addEventListener('blur', () => {
        osName.textContent = originalName;
        osName.classList.remove('sectionClicked')
    });

    osName.addEventListener('click', () => {
        osName.classList.add('sectionClicked')
    })

    return osName
}

//Updates Name
function updateName(groupOsId, osName) {
    groupedOs[groupOsId].forEach(os => {
        os.Name = osName
    })
    
    updateLocalStorage()
}

export { createOsNameCell }