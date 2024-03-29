import {
    itemlessOs,
    groupedOs,
    closeOsModalContainerQuick,
    checkForNullOsNames
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

    expandListButton.addEventListener('click', toggleDropdown);
    
    expandButtonContainer.appendChild(expandListButton)
    expandButtonContainer.appendChild(dropdownContent);

    // Add a click event listener to the document
    document.addEventListener('click', function(event) {
        const dropdownContent = document.getElementById('myDropdown');
        const expandListButton = document.querySelector('.expandListButton');
    
        if (dropdownContent) {
            const isDropdownShown = dropdownContent.classList.contains('showOsList');
            const isClickedInsideDropdown = dropdownContent.contains(event.target);
            const isClickedOnButton = expandListButton.contains(event.target);
    
            if (isDropdownShown && !isClickedInsideDropdown && !isClickedOnButton) {
                toggleDropdown();
            }
        }
    });
    
    osBtnsCell.appendChild(expandButtonContainer);
}

// Toggle dropdown visibility and rotate arrow
function toggleDropdown() {
    const dropdownContent = document.getElementById('myDropdown');
    const expandListButton = document.querySelector('.expandListButton');

    const isDropdownShown = dropdownContent.classList.toggle('showOsList');

    expandListButton.classList.toggle('rotate');

    if (isDropdownShown) {
        checkForNullOsNames();
        const allOs = [...Object.values(groupedOs).flatMap(group => group[0]), ...itemlessOs];
          
          allOs.sort((a, b) => a.Name.localeCompare(b.Name));

          allOs.forEach((os) => {
            const osRowList = createOsRow(os);
            dropdownContent.appendChild(osRowList);
        });
    } else {
        const osRows = dropdownContent.querySelectorAll('.osListRowHeader');
        osRows.forEach((osRow) => {
            osRow.remove();
        });
    }
}

function createOsRow(os) {
    const osListRowHeader = document.createElement('div');
    osListRowHeader.classList.add('osListRowHeader');
    osListRowHeader.classList.add('defaultColor');
    osListRowHeader.classList.add('folded')
    osListRowHeader.id = os.MenuItemOptionSetId

    osListRowHeader.style.backgroundColor = os.groupColor

    const osNameList = createOsNameHeader(os)
    
    const osSelectOptionList = createOsSelectOption(os)
    
    osListRowHeader.appendChild(osNameList)
    osListRowHeader.appendChild(osSelectOptionList)

    osListRowHeader.addEventListener('click', () => {
        closeOsModalContainerQuick()

        const osModalContainer = createOsModalContainer(os)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

    return osListRowHeader
}

function createOsNameHeader(os) {
    const osLenght = os.MenuItemOptionSetItems.length

    const osNameAndLengthList = document.createElement('div')
    osNameAndLengthList.className = 'osNameAndLengthList'
    osNameAndLengthList.innerHTML = `
    <p class='osNameList' style='color:#ffffff'>${os.Name}</p>
    <p class='osLenghtList' style='color:#ffffff'> (${osLenght})</p>`
    osNameAndLengthList.id = os.MenuItemOptionSetId

    return osNameAndLengthList
}

function createOsSelectOption(os) {
    const osListSelectOptionContainer = document.createElement('div')
    osListSelectOptionContainer.className = 'osListSelectOptionContainer'
    osListSelectOptionContainer.innerHTML = `
    <p class='minSelectCount' style='color:#ffffff' id='${os.MenuItemOptionSetId}'>${os.MinSelectCount}</p>
    <p class='dashCountCell'style='color:#ffffff'> - </p>
    <p class='maxSelectCount' style='color:#ffffff' id='${os.MenuItemOptionSetId}'>${os.MaxSelectCount}</p>`
    
    return osListSelectOptionContainer
}

export { osExpandListButton }