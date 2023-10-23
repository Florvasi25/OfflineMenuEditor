import { createOsModalNav } from './modalNav/osNav.js'

import { createOsModalBody } from './modalBody/osBody.js'

function createOsModalContainer(menuOs, itemId, sectionId, osId) {
    const leftContainer = document.getElementById('leftContainer')
    
    const osModalContainer = document.createElement('div')
    osModalContainer.classList = 'osModalContainer'
    
    const {osModalNav, closeOsModalBtn } = createOsModalNav(menuOs)
    osModalContainer.appendChild(osModalNav)

    const osModalBody = createOsModalBody(menuOs, sectionId, itemId, osId)
    osModalContainer.appendChild(osModalBody)
    

    closeOsModalBtn.addEventListener('click', () => {
        osModalContainer.classList.remove('show');
        osModalContainer.classList.add('hide');
        setTimeout(() => {
            osModalContainer.style.display = 'none'; 
            osModalContainer.classList.remove('hide'); 
            osModalContainer.remove()
        }, 300);
    });
    
    leftContainer.appendChild(osModalContainer)

    return osModalContainer
}

export { createOsModalContainer }