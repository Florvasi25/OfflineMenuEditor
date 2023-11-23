import {
    jsonData,
    updateLocalStorage,
    getRandomInt
} from '../context.js'

import {
    calculatePeriod,
    invertedDayMapping
} from "./clockUtils.js";

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

let clockSectionAvailabilityBtn;

function addSectionAvailabilityButton(clockFooterDiv, section) {
    clockSectionAvailabilityBtn =createAndAppend(clockFooterDiv, 'button', 'clockBtn', 'availabilityBtn');
    
    if (section.MenuSectionAvailability.AvailabilityMode == 1){
        addTextContent(clockSectionAvailabilityBtn, 'Section Availability Enabled');
        clockSectionAvailabilityBtn.classList.add('clockBtn-green'); 
    } else {
        addTextContent(clockSectionAvailabilityBtn, 'Section Availability Disabled');
        clockSectionAvailabilityBtn.classList.add('clockBtn-red'); 
    }

    clockSectionAvailabilityBtn.addEventListener('click', () => {
        if (clockSectionAvailabilityBtn.classList.contains('clockBtn-green')) {
            clockSectionAvailabilityBtn.classList.remove('clockBtn-green');
            clockSectionAvailabilityBtn.classList.add('clockBtn-red');
            addTextContent(clockSectionAvailabilityBtn, 'Section Availability Disabled');  
        } else {
            clockSectionAvailabilityBtn.classList.remove('clockBtn-red');
            clockSectionAvailabilityBtn.classList.add('clockBtn-green');
            addTextContent(clockSectionAvailabilityBtn, 'Section Availability Enabled');  
        }
    });
}
function availabilityTimes(sectionId, clockFooterDiv){
    if (clockSectionAvailabilityBtn.classList.contains('clockBtn-green')) {
        storeAvailabilityTimes(sectionId, clockFooterDiv);
        console.log("Se almacena");
    }else{
        deleteAvailiabilityTimes(sectionId)
        console.log("Se borra");
    }
}

function storeAvailabilityTimes(sectionId, clockFooterDiv)
{
 jsonData.MenuSections.forEach(MenuSection => {
    if (sectionId == MenuSection.MenuSectionId) {
        MenuSection.MenuSectionAvailability.AvailabilityMode = 1;
        MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
        getTableSchedule(clockFooterDiv, sectionId);
    }})
}

function deleteAvailiabilityTimes(sectionId)
{
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            MenuSection.MenuSectionAvailability.AvailabilityMode = 0;
            MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
            if (MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
                updateLocalStorage();
            }
        }})
}

function getTableSchedule(clockFooterDiv, id) {
    const clockContentDiv = clockFooterDiv.parentElement;
    const clockBodyDiv = clockContentDiv.querySelector('.clock-body');
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
    for (const row of tableRows) {
        const cells = row.cells;
        const dayName = cells[0].innerText;
        const dayOfWeek = invertedDayMapping[dayName]; // get the corresponding number for the day
        const StartTime = cells[1].querySelector('input').value;
        const CloseTime = cells[2].querySelector('input').value;
        let Period = calculatePeriod(StartTime, CloseTime)

        storeBikeTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id);
    }
}

function storeBikeTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, sectionId) {
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            if(!MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
            }
            // Remove any object from AvailableTimes that has the same dayOfWeek 
            // as the object we are pushing, to avoid duplicated objects.
            MenuSection.MenuSectionAvailability.AvailableTimes = 
                MenuSection.MenuSectionAvailability.AvailableTimes.filter(time => time.dayOfWeek !== dayOfWeek);            
            // If it's the first object, get a random ID,
            // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in AvailableTimes, 
            // determines the highest value using Math.max, and adds +1. 
            let Id = (MenuSection.MenuSectionAvailability.AvailableTimes.length === 0) ? 
                getRandomInt() : 
                Math.max(...MenuSection.MenuSectionAvailability.AvailableTimes.map(item => item.BusinessHoursPeriodId)) + 1;
            // Create the new time object
            const newTime = {
                BusinessHoursPeriodId: Id,
                dayOfWeek,
                StartTime,
                CloseTime,
                Period,
                StartTimeEarly: StartTime,
                PeriodEarly: "00:00"
            };    
            // Push the new time to the array
            MenuSection.MenuSectionAvailability.AvailableTimes.push(newTime);
            updateLocalStorage();
        }
    });
}

export{
    addSectionAvailabilityButton,
    availabilityTimes
}