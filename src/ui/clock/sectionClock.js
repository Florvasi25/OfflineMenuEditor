import {
    jsonData, 
    getRandomInt, 
    updateSectionLocalStorage
} from '../context.js'

import {
    createAndAppend,
    addTextContent,
    createClockBody,
    createClockTable,
    createInputCell,
    dayMappingToName
} from './clockUtils.js'

function sectionClockButton(sectionButtonsCell, sectionId) {
    const clockButton = createAndAppend(sectionButtonsCell, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';

    clockButton.addEventListener('click', () => {
        const clockElements = createClockBody();
        const clockBodyDiv = clockElements.clockBodyDiv;
        const clockSaveBtn = clockBodyDiv.parentElement.querySelector('.clockBtn-save');  
        const seccion = getSection(jsonData, sectionId);    
        createClockTable(clockBodyDiv, clockSaveBtn, seccion, sectionId);
    });
}

function createSectionTableRows(parentElement, menuSection) {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    const areDailySpecialHoursSame = compareDailySpecialHours(menuSection);
    console.log("Comparación: ", areDailySpecialHoursSame);
    const timesMapping = {};
    // If all DailySpecialHours are the same for all MenuItems, then take the DailySpecialHours data 
    if (areDailySpecialHoursSame && 
        menuSection.MenuItems.length > 0 && 
        menuSection.MenuItems[0].DailySpecialHours) 
        { menuSection.MenuItems[0].DailySpecialHours.forEach(time => {
            timesMapping[time.dayOfWeek] = {
                start: time.StartTime,
                close: time.CloseTime
            };
        });
    }
    // Go through each day and create a row for it
    dayOrder.forEach(dayKey => {
        const row = createAndAppend(parentElement, 'tr');
        const dayName = dayMappingToName[dayKey];
        // Default values
        let times = ['01:00', '00:00'];
        // If times for this day exists in timesMapping, overwrite the defaults
        if (timesMapping[dayKey]) {
            times = [timesMapping[dayKey].start, timesMapping[dayKey].close];
        }
        // Populate the row
        [dayName, ...times].forEach((text, index) => {
            if (index === 0) {
                const cell = createAndAppend(row, 'td');
                addTextContent(cell, text);
            } else {
                createInputCell(row, text);
            }
        });
    });
}
// Store the data in an object and push it to the jsonData local storage
function storeSectionTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, sectionId) {
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            MenuSection.MenuItems.forEach(MenuItem => {
                if(!MenuItem.DailySpecialHours) {
                    MenuItem.DailySpecialHours = [];
                }
                // Remove any object from DailySpecialHours that has the same dayOfWeek 
                // as the object we are pushing, to avoid duplicated objects.
                MenuItem.DailySpecialHours = 
                    MenuItem.DailySpecialHours.filter(time => time.dayOfWeek !== dayOfWeek);

                // If it's the first object, get a random ID,
                // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in DailySpecialHours, 
                // determines the highest value using Math.max, and adds +1. 
                let Id = (MenuItem.DailySpecialHours.length === 0) ? 
                    getRandomInt() : 
                    Math.max(...MenuItem.DailySpecialHours.map(item => item.BusinessHoursPeriodId)) + 1;
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
                MenuItem.DailySpecialHours.push(newTime);
            });
            updateSectionLocalStorage();
        }
    });
}
/*function getAvailableTimes(jsonData, sectionId) {
    const foundSection = jsonData.MenuSections.find(MenuSection => MenuSection.MenuSectionId == sectionId);
    if (foundSection) {
        return foundSection.MenuSectionAvailability.AvailableTimes;
    }
    return null;
}*/
function getSection(jsonData, sectionId) {
    const foundSection = jsonData.MenuSections.find(MenuSection => MenuSection.MenuSectionId == sectionId);
    if (foundSection) {
        return foundSection;
    }
    return null;
}
function compareDailySpecialHours(menuSection) {
    if (!menuSection.MenuItems || menuSection.MenuItems.length <= 1) {
        return true; // if there's only one or no items, then they are inherently the same
    }
    const baseHours = menuSection.MenuItems[0].DailySpecialHours;
    for (let i = 1; i < menuSection.MenuItems.length; i++) {
        const currentHours = menuSection.MenuItems[i].DailySpecialHours;
        if (baseHours.length !== currentHours.length) {
            return false; // if the lengths are different, then they're not the same
        }
        for (let j = 0; j < baseHours.length; j++) {
            if (baseHours[j].StartTime !== currentHours[j].StartTime ||
                baseHours[j].Period !== currentHours[j].Period ||
                baseHours[j].StartTimeEarly !== currentHours[j].StartTimeEarly) {
                return false; // if any of the properties don't match, then they're not the same
            }
        }
    }
    return true; // if we made it here, then all DailySpecialHours are the same for all MenuItems
}
export {
    sectionClockButton,
    createSectionTableRows,
    storeSectionTimeTableInJson
} 
