// // Create a button element
// // const openModalButton = document.createElement("button");
// // const openModalButton = document.querySelector('.osAddNew');
// // console.log(openModalButton);
// // openModalButton.textContent = "Open Modal";
// // document.body.appendChild(openModalButton);

// function createSelectOsModalContainer () {
//     const selectOsModalContainer = document.createElement("div");
//     selectOsModalContainer.id = "selectOsModalContainer";
//     selectOsModalContainer.className = "selectOsModalContainer";
//     document.body.appendChild(selectOsModalContainer);
    
//     // Create selectOsModalContainer content
//     const modalContent = document.createElement("div");
//     modalContent.className = "selectOsModalContainer-content";
//     selectOsModalContainer.appendChild(modalContent);
//     // Create a modal container
    
//     // Create close button
//     const closeModalButton = document.createElement("span");
//     closeModalButton.className = "close";
//     closeModalButton.textContent = "×";
//     modalContent.appendChild(closeModalButton);
    
//     // Create the list
//     const ul = document.createElement("ul");
//     modalContent.appendChild(ul);
//     // Add list items
//     const items = ["Apples", "Bananas", "Oranges", "Grapes"];
//     items.forEach(itemText => {
//         const li = document.createElement("li");
//         li.textContent = itemText;
//         ul.appendChild(li);
//     });
    
//     // Function to open the modal smoothly
//     // Open the modal when the button is clicked
//     // openModalButton.addEventListener("click", openModal);
    
//     // Close the modal when the close button is clicked
//     closeModalButton.addEventListener("click", closeModal);

//     return selectOsModalContainer
// }

// function openModal() {
//     modal.style.display = "block";
//     setTimeout(() => {
//         modal.style.opacity = 1;
//     }, 10);
// }

// // Function to close the modal smoothly
// function closeModal() {
//     modal.style.opacity = 0;
//     setTimeout(() => {
//         modal.style.display = "none";
//     }, 300);
// }


// // Close the modal when clicking outside the modal content
// // window.addEventListener("click", (event) => {
// //     if (event.target === modal) {
// //         closeModal();
// //     }
// // });

import { createSelectOsModalNav } from '../selectOsModal/selectOsModalNav/selectOsNav.js'

// import { createOsModalBody } from './modalBody/osBody.js'

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

    // const osModalBody = createOsModalBody(menuOs, sectionId, itemId, osId)
    // osModalContainer.appendChild(osModalBody)
    
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
