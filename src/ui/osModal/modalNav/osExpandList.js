import {
    itemlessOs,
    groupedOs
} from '../../context.js'

import {
    createOsModalContainer
} from '../../osModal/modalContainer.js'

function osExpandListButton(osBtnsCell) {
    const expandButtonContainer = document.createElement('div')
    expandButtonContainer.className = 'expandButtonContainer'

    const expandListButton = document.createElement('button');
    expandListButton.classList.add('sectionButton')
    expandListButton.classList.add('expandListButton')
    const expandListButtonImg = document.createElement('img')
    expandListButtonImg.classList.add('expandListButtonImg')
    expandListButtonImg.src = '../../assets/expandIcon.svg'
    expandListButton.appendChild(expandListButtonImg)

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');
    dropdownContent.id = 'myDropdown';

    const foundGroupedOs = Object.values(groupedOs).flatMap(group => group[0])
    console.log('menuOs', foundGroupedOs);

    foundGroupedOs.forEach((os) => {
        const osRowList = createOsRow(os)

        dropdownContent.appendChild(osRowList);
    });

    const foundItemlessOs = itemlessOs

    foundItemlessOs.forEach((os) => {
        const osRowList = createOsRow(os)

        dropdownContent.appendChild(osRowList);
    })

    expandListButton.addEventListener('click', toggleDropdown);
    
    expandButtonContainer.appendChild(expandListButton)
    expandButtonContainer.appendChild(dropdownContent);
    
    osBtnsCell.appendChild(expandButtonContainer);
}

// Toggle dropdown visibility and rotate arrow
function toggleDropdown() {
    const dropdownContent = document.getElementById('myDropdown');
    dropdownContent.classList.toggle('show');

    const expandListButton = document.querySelector('.expandListButton');
    expandListButton.classList.toggle('rotate');
}


function createOsRow(os) {
    const osRowList = document.createElement('div');
    osRowList.classList.add('osRowList');

    const osListRowHeader = document.createElement('div');
    osListRowHeader.classList.add('osListRowHeader');
    osListRowHeader.classList.add('defaultColor');
    osListRowHeader.classList.add('folded')
    osListRowHeader.id = os.MenuItemOptionSetId
    osRowList.appendChild(osListRowHeader);

    const osNameList = createOsNameHeader(os)
    osListRowHeader.appendChild(osNameList)

    return osRowList
}


function createOsNameHeader(os) {
    const osNameList = document.createElement('p')
    osNameList.className = 'osNameList'
    osNameList.textContent = os.Name
    osNameList.id = os.MenuItemOptionSetId
    osNameList.addEventListener('click', () => {
        const existingOsModal = document.querySelector('.osModalContainer')
        if (existingOsModal) {
            existingOsModal.remove()
        }
        const osModalContainer = createOsModalContainer(os)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

    return osNameList
}



export { osExpandListButton }