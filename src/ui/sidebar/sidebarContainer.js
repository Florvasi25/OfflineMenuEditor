function createOsModalContainer() {
    const leftContainer = document.getElementById('leftContainer')
    
    const osModalContainer = document.createElement('div')
    osModalContainer.id = 'myModal'
    osModalContainer.classList = 'osModalContainer'
    
    const {osModalNav, closeOsModalBtn } = createOsModalNav()
    osModalContainer.appendChild(osModalNav)

    closeOsModalBtn.addEventListener('click', () => {
        osModalContainer.classList.remove('show');
        osModalContainer.classList.add('hide'); 
        setTimeout(() => {
            osModalContainer.style.display = 'none'; 
            osModalContainer.classList.remove('hide'); 
        }, 300);
    });
    
    leftContainer.appendChild(osModalContainer)

    return osModalContainer
}

function createOsModalNav() {
    const osModalNav = document.createElement('div')
    osModalNav.className = 'osModalNav'

    const closeOsModalBtn = createCloseOsModalBtn()
    osModalNav.appendChild(closeOsModalBtn)

    return { osModalNav, closeOsModalBtn }
}

function createCloseOsModalBtn() {
    const closeOsModalBtn = document.createElement('button')
    closeOsModalBtn.className = 'closeOsModalBtn'
    closeOsModalBtn.id = 'closeOsModalBtn'
    closeOsModalBtn.textContent = 'X'

    return closeOsModalBtn
}

export { createOsModalContainer }
