import { closeOsModalContainerQuick } from '../context.js'

import { createSelectOsModalNav } from '../selectOsModal/selectOsModalNav/selectOsNav.js'

import { createSelectOsModalBody } from '../selectOsModal/selectOsModalBody/selectOsBody.js'

function createSelectOsModalContainer(itemRow) {
    const popupModal = document.getElementById('popupModal')
    
    const selectOsModal = document.createElement('div')
    selectOsModal.classList = 'selectOsModal'
    
    const selectOsModalContainer = document.createElement('div')
    selectOsModalContainer.classList = 'selectOsModalContainer'

    selectOsModal.appendChild(selectOsModalContainer)
    
    const {selectOsModalNav, closeOsModalBtn } = createSelectOsModalNav()
    selectOsModalContainer.appendChild(selectOsModalNav)

    const selectOsModalBody = createSelectOsModalBody(itemRow)

    selectOsModalContainer.appendChild(selectOsModalBody)
    
    closeOsModalBtn.addEventListener('click', () => {
        selectOsModal.style.opacity = 0
        setTimeout(() => {
            const existingSelectOsModal = document.querySelector('.selectOsModal')
            if (existingSelectOsModal) {
                existingSelectOsModal.remove()
            }
            selectOsModal.style.display = 'none'; 
        }, 200);
    });
    
    popupModal.appendChild(selectOsModal)

    closeOsModalContainerQuick()

    return selectOsModal
}

export { createSelectOsModalContainer }
