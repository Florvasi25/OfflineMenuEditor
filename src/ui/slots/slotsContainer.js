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
    const slotsBtnsContainer = document.createElement('div');
    slotsBtnsContainer.className = 'slotsBtnsContainer';
    slotsBtnsContainer.style.left = '-40vw';
    slotsBtnsContainer.style.display = 'flex';

    slotsBtnsContainer.appendChild(createSlotButton('First Slot', 'slotButton1'));
    slotsBtnsContainer.appendChild(createSlotButton('Second Slot', 'slotButton2'));
    slotsBtnsContainer.appendChild(createSlotButton('Third Slot', 'slotButton3'));
    slotsBtnsContainer.appendChild(createSlotButton('Fourth Slot', 'slotButton4'));
    slotsBtnsContainer.appendChild(createSlotButton('Fifth Slot', 'slotButton5'));
    slotsBtnsContainer.appendChild(createSlotButton('Sixth Slot', 'slotButton6'));
    slotsBtnsContainer.appendChild(createSlotButton('Seventh Slot', 'slotButton7'));

    return slotsBtnsContainer
}

function createSlotButton(buttonText, buttonId) {
    const slotButton = document.createElement('button');
    slotButton.className = 'slotBtn';
    slotButton.textContent = localStorage.getItem(buttonId) || buttonText;
    slotButton.id = buttonId;
    slotButton.contentEditable = 'true';
    slotButton.spellcheck = false;

    /*slotButton.addEventListener('blur', function() {
        localStorage.setItem(buttonId, slotButton.textContent);
    });*/

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
        leftBtnContainer.style.width = '17.5vw';
    }
}

export { createLeftContainer }