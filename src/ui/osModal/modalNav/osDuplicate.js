import {
    addItemlessOs
} from '../../context.js';

import { createOsModalContainer } from "../modalContainer.js";

function osDuplicateButton(osBtnsCell, menuOs) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    osBtnsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOs(menuOs);
    });
    
}

function duplicateOs(menuOs) {
    const newOs = JSON.parse(JSON.stringify(menuOs));
    newOs.Name += "_copy"

    addItemlessOs(newOs)
    
    const existingOsModal = document.querySelector('.osModalContainer')
    if (existingOsModal) {
        existingOsModal.remove()
    }

    const openOsModalContainer = createOsModalContainer(newOs)
    openOsModalContainer.style.display = 'block';
    setTimeout(() => {
        openOsModalContainer.classList.add('show');
    }, 10);
}

export { osDuplicateButton }