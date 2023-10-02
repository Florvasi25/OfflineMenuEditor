import {
    compareDailySpecialHours
} from "./sectionClock.js";
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
    addTextContent(clockSectionAvailabilityBtn, 'Section Availability');
    
    if(compareDailySpecialHours(section) && section.MenuItems[0] && section.MenuItems[0].DailySpecialHours[0]){
        clockSectionAvailabilityBtn.classList.add('clockBtn-availability-enabled')
        clockSectionAvailabilityBtn.addEventListener('click', () => {
            storeAvailabilityTimes(section.MenuSectionId);
            // Find clockModalDiv and hide it
            let parentElement = clockFooterDiv;
            while(parentElement && !parentElement.classList.contains('clockModal')) {
                console.log("1");
                parentElement = parentElement.parentNode;
            }
            if(parentElement) {
                console.log("Entró");
                parentElement.style.display = 'none';
            }
        });
    } else{
        clockSectionAvailabilityBtn.disabled = true;
        clockSectionAvailabilityBtn.classList.add('clockBtn-availability-disabled')
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
export{
    addSectionAvailabilityButton,
}