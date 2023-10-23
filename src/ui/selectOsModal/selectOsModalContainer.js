import { createSelectOsModalNav } from '../selectOsModal/selectOsModalNav/selectOsNav.js'

function createSelectOsModalContainer() {
    const popupModal = document.getElementById('popupModal')
    
    const selectOsModal = document.createElement('div')
    selectOsModal.classList = 'selectOsModal'
    
    const selectOsModalContainer = document.createElement('div')
    selectOsModalContainer.classList = 'selectOsModalContainer'

    selectOsModal.appendChild(selectOsModalContainer)
    
    const {selectOsModalNav, closeOsModalBtn } = createSelectOsModalNav()
    selectOsModalContainer.appendChild(selectOsModalNav)

    const selectOsModalBody = document.createElement('p')
    selectOsModalBody.textContent = 'Os list'

    selectOsModalContainer.appendChild(selectOsModalBody)
    
    closeOsModalBtn.addEventListener('click', () => {
        const existingSelectOsModal = document.querySelector('.selectOsModal')
        if (existingSelectOsModal) {
            existingSelectOsModal.remove()
        }
        selectOsModal.style.opacity = 0
        setTimeout(() => {
            selectOsModal.style.display = 'none'; 
        }, 300);
    });
    
    popupModal.appendChild(selectOsModal)

    return selectOsModal
}

export { createSelectOsModalContainer }
