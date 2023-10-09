import {
    jsonData,
    updateSectionLocalStorage
} from '../context.js'
import {
    createAndAppend,
    addTextContent
} from "./clockUtils.js";

function addSectionAvailabilityButton(clockFooterDiv, section) {
    const clockSectionAvailabilityBtn = createAndAppend(clockFooterDiv, 'button', 'clockBtn', 'clockBtn-availability');
    
    if(section.MenuSectionAvailability.AvailabilityMode = 1){
        addTextContent(clockSectionAvailabilityBtn, 'Section Availability Enabled');
        clockSectionAvailabilityBtn.classList.add('clockBtn-green'); 
    }else{
        addTextContent(clockSectionAvailabilityBtn, 'Section Availability Disabled');
        clockSectionAvailabilityBtn.classList.add('clockBtn-red'); 
    }
    // Set initial button state
    if (section.MenuItems[0] && section.MenuItems[0].DailySpecialHours[0]) {
        clockSectionAvailabilityBtn.addEventListener('click', () => {
            if (clockSectionAvailabilityBtn.classList.contains('clockBtn-green')) {
                clockSectionAvailabilityBtn.classList.remove('clockBtn-green');
                clockSectionAvailabilityBtn.classList.add('clockBtn-red');
                deleteAvailiabilityTimes(section.MenuSectionId);
            } else {
                clockSectionAvailabilityBtn.classList.remove('clockBtn-red');
                clockSectionAvailabilityBtn.classList.add('clockBtn-green');
                addTextContent(clockSectionAvailabilityBtn, 'Section Availability Enabled');
                storeAvailabilityTimes(section.MenuSectionId);
            }
        });
    } else {
        addTextContent(clockSectionAvailabilityBtn, 'Section Availability Disabled');
        clockSectionAvailabilityBtn.disabled = true;
        clockSectionAvailabilityBtn.classList.add('clockBtn-availability-disabled');
    }
}


function storeAvailabilityTimes(sectionId)
{
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId){
            MenuSection.MenuSectionAvailability.AvailabilityMode = 1;
            MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
            const dailySpecialHours = MenuSection.MenuItems[0].DailySpecialHours;
            MenuSection.MenuSectionAvailability.AvailableTimes = dailySpecialHours;
            updateSectionLocalStorage();
        }})
}

function deleteAvailiabilityTimes(sectionId)
{
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId){
            MenuSection.MenuSectionAvailability.AvailabilityMode = 0;
            MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
            if (MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
            }
            updateSectionLocalStorage();
        }})
}
export{
    addSectionAvailabilityButton,
}