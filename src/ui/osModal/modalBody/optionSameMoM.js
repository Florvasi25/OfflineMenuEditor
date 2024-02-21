import { 
    updateLocalStorage,
    itemlessOs,
    jsonData,
    addWarningMoM
} from "../../context.js";

import { slotManagerInstance } from  "../../mainContainer.js";

import { showToolTip } from "../../toolTip.js";

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
        sameMoMInput.style.color = '#000000'
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
        
        checkMoM(textMoM, menuOs)

        handleSameMoM(menuOs, sameMoMInput, textMoM)
        addWarningMoM()
    })
    
    sameMoMInput.addEventListener('blur', (e) => {
        if (sameMoMInput.textContent == '') {
            sameMoMInput.textContent = 'Edit all MoM'
            sameMoMInput.style.color = '#a3a3a3'
        }
    })
}

function checkMoM(textMoM, menuOs) {
    if (itemlessOs.includes(menuOs)) {
        showToolTip(sameMoMInput, 'This OS does not belong to an Item');
        return
    } else {
        const foundItem = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .find(i => i.MenuItemId == menuOs.MenuItemId);
        const menuItemOptionSetIds = foundItem.MenuItemOptionSets.flatMap(i => i.MenuItemOptionSetId);
        const newOptionMoM = textMoM

        // If the entered value is not empty, check its validity
        if (newOptionMoM !== "") {
            // Allow '-1' as a valid value
            if (newOptionMoM !== '-1' && !menuItemOptionSetIds.includes(Number(newOptionMoM))) {
                // Show tooltip if the entered value doesn't exist
                showToolTip(sameMoMInput, 'The MenuItemOptionSetId does not exist in this Item');
                return;
            } else if (newOptionMoM == menuOs.MenuItemOptionSetId) {
                showToolTip(sameMoMInput, 'The MenuItemOptionSetId is the same as the current OS');
                return;
            }
        } 
    }
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
    sameMoMInput.style.color = '#a3a3a3'
}

export { createSameMoMButton }