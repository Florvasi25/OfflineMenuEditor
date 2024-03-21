import { closeOsModalContainer } from "../context.js";

function createLeftContainer() {
    const leftContainer = document.getElementById('leftContainer');
    leftContainer.className = "leftContainer";

    const boxLeftMenuButton = createSlotsContainer();

    leftContainer.appendChild(boxLeftMenuButton);
}

function createSlotsContainer() {
    const boxLeftMenu = document.createElement('div');
    boxLeftMenu.className = 'boxLeftMenu';
    boxLeftMenu.classList.add('folded');
    
    const slotsBtnsContainer = createSlotsButtonContainer();

    const leftBtnContainer = document.createElement('div');
    leftBtnContainer.className = 'leftBtnContainer';

    const leftBtn = document.createElement('div');
    leftBtn.className = 'leftBtn';

    leftBtnContainer.appendChild(leftBtn);

    leftBtnContainer.addEventListener('click', event => {
        toggleOsState(boxLeftMenu, slotsBtnsContainer, leftBtnContainer);
        event.stopPropagation();
    });

    boxLeftMenu.appendChild(slotsBtnsContainer);
    boxLeftMenu.appendChild(leftBtnContainer);

    return boxLeftMenu;
}

function createSlotsButtonContainer () {
    const boxLeftMenu = document.querySelector('.boxLeftMenu');
    const slotsBtnsContainer = document.createElement('div');
    slotsBtnsContainer.className = 'slotsBtnsContainer';
    slotsBtnsContainer.style.left = '-40vw';
    slotsBtnsContainer.style.display = 'flex';

    slotsBtnsContainer.appendChild(createSlotButton('First Slot', 'slotButton1', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Second Slot', 'slotButton2', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Third Slot', 'slotButton3', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Fourth Slot', 'slotButton4', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Fifth Slot', 'slotButton5', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Sixth Slot', 'slotButton6', slotsBtnsContainer));
    slotsBtnsContainer.appendChild(createSlotButton('Seventh Slot', 'slotButton7', slotsBtnsContainer));

    return slotsBtnsContainer
}


function createSlotButton(buttonText, buttonId, slotsBtnsContainer) {
    const slotButton = document.createElement('button');
    slotButton.className = 'slotBtn';
    slotButton.textContent = localStorage.getItem(buttonId) || buttonText;
    slotButton.id = buttonId;

    slotButton.addEventListener('click', () => {
        const leftBtnContainer = document.querySelector('.leftBtnContainer');
        const boxLeftMenu = document.querySelector('.boxLeftMenu');
        toggleOsState(boxLeftMenu, slotsBtnsContainer, leftBtnContainer);

        closeOsModalContainer()
    });

    return slotButton;
}


function toggleOsState(boxLeftMenu, slotsBtnsContainer, leftBtnContainer) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';
    const showClassName = 'show';
    const hideClassName = 'hide';

    if (boxLeftMenu.classList.contains(expandedClassName)) {
        boxLeftMenu.classList.remove(expandedClassName);
        boxLeftMenu.classList.add(foldedClassName);

        setTimeout(() => {
            slotsBtnsContainer.classList.remove(showClassName);
            slotsBtnsContainer.classList.add(hideClassName);
            
            leftBtnContainer.classList.remove(showClassName);
            leftBtnContainer.classList.add(hideClassName);
        }, 300);
        
        slotsBtnsContainer.style.left = '-40vw';
        leftBtnContainer.style.width = '25px';

    } else {
        boxLeftMenu.classList.remove(foldedClassName);
        boxLeftMenu.classList.add(expandedClassName);
        
        setTimeout(() => {
            slotsBtnsContainer.classList.remove(hideClassName);
            slotsBtnsContainer.classList.add(showClassName);
            
            leftBtnContainer.classList.remove(hideClassName);
            leftBtnContainer.classList.add(showClassName);
        }, 10);

        slotsBtnsContainer.style.display = 'flex';
        slotsBtnsContainer.style.left = '0';
        leftBtnContainer.style.width = '32vw';
    }
}

export { createLeftContainer }