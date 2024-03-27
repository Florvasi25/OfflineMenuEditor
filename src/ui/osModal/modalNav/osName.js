import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessLocalStorage
} from '../../context.js'

import { slotManagerInstance } from  "../../mainContainer.js";

function createOsNameCell(menuOs) {
    //Name Cell
    const osNameCell = document.createElement('div');
    osNameCell.classList.add('osNameCell');

    const osNameHeader = createOsName(menuOs)
    osNameCell.appendChild(osNameHeader);

    return osNameCell
}

//Handles Name Edits
function createOsName(menuOs) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOsName = osName.textContent;
            originalName = newOsName;
            osName.blur();

            updateName(menuOs, newOsName);

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader'));
                const osNameHeader = osNameHeaderArray.filter(p => optionSetIds.includes(p.id));
                osNameHeader.forEach(os => {
                    os.textContent = menuOs.Name;
                })
                if (menuOs.Name == null || menuOs.Name == '') {
                    osNameHeader.forEach(os => {
                        os.textContent = 'Empty';
                    })                
                } else {
                    osNameHeader.forEach(os => {
                        os.textContent = menuOs.Name;
                    })                
                }
            }
        } else if (e.key === 'Escape') {
            osName.textContent = originalName;
            osName.blur();
        }
    });

    osName.addEventListener('blur', () => {
        osName.textContent = originalName;
    });

    osName.addEventListener('click', () => {
        if (osName.textContent.startsWith("New Option Set")) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(osName);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    return osName;
}


//Updates Name
function updateName(menuOs, osName) {
    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.Name = osName
        })
        groupOptionSets();
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        menuOs.Name = osName;
        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }
}

export { createOsNameCell }