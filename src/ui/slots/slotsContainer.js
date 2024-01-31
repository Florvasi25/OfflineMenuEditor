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
    
    const slotsBtnsContainer = createSlotsButtons ()

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
    slotsBtnsContainer.style.left = '-15vw';
    slotsBtnsContainer.style.display = 'flex';

    const firstSlot = document.createElement('button')
    firstSlot.className = 'slotBtn';
    firstSlot.textContent = 'First Slot'

    const secondSlot = document.createElement('button')
    secondSlot.className = 'slotBtn';
    secondSlot.textContent = 'Second Slot'

    const thirdSlot = document.createElement('button')
    thirdSlot.className = 'slotBtn';
    thirdSlot.textContent = 'Third Slot'

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
        
        slotsBtnsContainer.style.left = '-15vw';
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
        leftBtnContainer.style.width = '17vw';
    }
}




export { createLeftContainer }