import {
    updateLocalStorage,
    groupedOs
} from '../../context.js'

function optionVisibilityButton(optionButtonsCell, optionRow, menuOption, menuOs) {
    const visibilityButton = document.createElement('button');
    visibilityButton.classList.add('sectionButton')
    visibilityButton.classList.add('visibilityButton')
    visibilityButton.addEventListener('click', () => {
        SectionAvailability(optionRow, menuOs, menuOption);
    });
    optionButtonsCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement('img')
    visibilityButtonImg.classList.add('sectionButtonImg')
    visibilityButtonImg.src = '../../assets/visibilityIcon.svg'
    visibilityButton.appendChild(visibilityButtonImg)

    //Unavailable Sections - Gray
    if (!menuOption.IsAvailable) {
        optionRow.classList.add('unavailable');
        visibilityButton.classList.add('hiddenSection')
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener('click', () => {
        if (!menuOption.IsAvailable) {
            visibilityButton.classList.add('hiddenSection')
        } else {
            visibilityButton.classList.remove('hiddenSection')
        }
    })
}

//Section Availability
function SectionAvailability(optionRow, menuOs, menuOption) {
    const optionToHide = optionRow.id;

    if (optionToHide) {
        const optionObject = groupedOs[menuOs.groupOsId][0].MenuItemOptionSetItems.find(option => option.groupOptionId == optionToHide)
        const isAvailableNew = !optionObject.IsAvailable

        groupedOs[menuOs.groupOsId].forEach(os => {
            console.log(optionObject);
            optionObject.IsAvailable = isAvailableNew
        })
        
        optionRow.classList.toggle('unavailable', !isAvailableNew);

        const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));

        const optionContainerPreview = optionContainerPreviewArray.filter((element) => {
          const groupOsId = element.getAttribute('groupOsId');
          return groupOsId === menuOs.groupOsId;
        });
        
        if (optionContainerPreview) {
            optionContainerPreview.forEach((osRowOptionContainerPreview) => {
                const osRowOptionPreviewArray = Array.from(osRowOptionContainerPreview.getElementsByClassName('osRowOption'));
                
                osRowOptionPreviewArray.forEach(osRowOptionPreview => {
                    if (osRowOptionPreview.id === menuOption.groupOptionId) {
                        osRowOptionPreview.classList.toggle('unavailable', !isAvailableNew)
                    }
                });
            });
        }
        updateLocalStorage()
    }
}

export { optionVisibilityButton }