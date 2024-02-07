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
    
    const slotsBtnsContainer = createSlotsButtons();

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

function createSlotsButtons () {
    const slotsBtnsContainer = document.createElement('div');
    slotsBtnsContainer.className = 'slotsBtnsContainer';
    slotsBtnsContainer.style.left = '-40vw';
    slotsBtnsContainer.style.display = 'flex';

    const firstSlot = document.createElement('button')
    firstSlot.className = 'slotBtn';
<<<<<<< Updated upstream
    firstSlot.textContent = '1st Slot'

    const secondSlot = document.createElement('button')
    secondSlot.className = 'slotBtn';
    secondSlot.textContent = '2nd Slot'

    const thirdSlot = document.createElement('button')
    thirdSlot.className = 'slotBtn';
    thirdSlot.textContent = '3rd Slot'
=======
    firstSlot.textContent = 'First Slot'
    firstSlot.id = 'slotButton1';

    const secondSlot = document.createElement('button')
    secondSlot.className = 'slotBtn';
    secondSlot.textContent = 'Second Slot'
    secondSlot.id = 'slotButton2';

    const thirdSlot = document.createElement('button')
    thirdSlot.className = 'slotBtn';
    thirdSlot.textContent = 'Third Slot'
    thirdSlot.id = 'slotButton3';
>>>>>>> Stashed changes

    slotsBtnsContainer.appendChild(firstSlot);
    slotsBtnsContainer.appendChild(secondSlot);
    slotsBtnsContainer.appendChild(thirdSlot);

    return slotsBtnsContainer
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