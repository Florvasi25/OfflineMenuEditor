import { updateLocalStorage } from "../../context.js";

import { slotManagerInstance } from  "../../mainContainer.js";

function createSameMoMButton(menuOs, topButtonsCell) {
    const sameMoMContainer = document.createElement('div')
    sameMoMContainer.className = 'sameMoMContainer'
    
    const sameMoMInput = document.createElement('p')
    sameMoMInput.classList.add('sameMoMInput')
    sameMoMInput.contentEditable = true
    sameMoMInput.textContent = 'Edit all MoM'

    sameMoMInput.addEventListener('click', (e) => {
        sameMoMInput.textContent = ""
        sameMoMInput.style.textAlign = 'center'
    })
    
    const sameMoMButton = document.createElement('button');
    sameMoMButton.classList.add('sectionButton');
    sameMoMButton.classList.add('sameMoMButton');
    
    sameMoMContainer.appendChild(sameMoMInput);
    sameMoMContainer.appendChild(sameMoMButton);
    topButtonsCell.appendChild(sameMoMContainer);
    
    const sameMoMButtonImg = document.createElement('img')
    sameMoMButtonImg.classList.add('sectionButtonImg')
    sameMoMButtonImg.src = '../../assets/sameMoMIcon.svg'
    sameMoMButton.appendChild(sameMoMButtonImg)
    
    sameMoMButton.addEventListener('click', () => {
        const textMoM = document.getElementsByClassName('sameMoMInput')[0].textContent
        console.log('textMoM before handle', textMoM);
        handleSameMoM(menuOs, sameMoMInput, textMoM)
    })
    
    sameMoMInput.addEventListener('blur', (e) => {
        if (sameMoMInput.textContent == '') {
            sameMoMInput.textContent = 'Edit all MoM'
        }
    })
}

function handleSameMoM(menuOs, sameMoMInput, textMoM) {
    menuOs.MenuItemOptionSetItems.forEach((menuOption) => {
        
        if (textMoM == "Edit all MoM") {
            return
        } 

        menuOption.NextMenuItemOptionSetId = Number(textMoM)

        const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'))
        const optionContainerPreview = optionContainerPreviewArray.find(p => p.id == menuOs.MenuItemOptionSetId)
    
        const optionMoMPreviewArray = Array.from(optionContainerPreview.getElementsByClassName('optionMoMPreview'))
        optionMoMPreviewArray.forEach(optionMoMPreview => {
            optionMoMPreview.textContent = textMoM
        })
    
        const optionMoMModal = Array.from(document.getElementsByClassName('optionMoM'))
        optionMoMModal.forEach(optionMoM => {
            optionMoM.textContent = textMoM
            optionMoM.style.color = '#000000'
        })
    
        updateLocalStorage(slotManagerInstance.currentSlot)
    })
    
    sameMoMInput.textContent = 'Edit all MoM'
}

export { createSameMoMButton }