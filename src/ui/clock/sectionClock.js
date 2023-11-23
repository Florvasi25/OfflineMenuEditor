import {
    jsonData, 
    getRandomInt, 
    updateLocalStorage,
} from '../context.js'

import {
    createClockBody,
    createClockTable,
    createInputCell,
    dayMappingToName,
    processSaveChanges
} from './clockUtils.js'

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import { addSectionAvailabilityButton } from "./sectionAvailability.js";
import { changeItemClockIcon } from "./itemClock.js";

function sectionClockButton(sectionButtonsCell, sectionId) {
    const clockButton = createAndAppend(sectionButtonsCell, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';
   
    clockButton.addEventListener('click', () => {
        const clockElements = createClockBody();
        const clockModalDiv = clockElements.clockModalDiv;
        const clockBodyDiv = clockElements.clockBodyDiv;
        const clockFooterDiv = clockElements.clockFooterDiv;
        
        //const clockSaveBtn = clockBodyDiv.parentElement.querySelector('.clockBtn-save');  
        const section = getSection(jsonData, sectionId);    
        const availabilityContainer = createAndAppend(clockFooterDiv, 'div', 'availability-container');
        const actionButtonsContainer = createAndAppend(clockFooterDiv, 'div', 'action-buttons');
        if(compareDailySpecialHours(section)) {
            addSectionAvailabilityButton(availabilityContainer, section);
            const clockSaveBtn = addSaveChangesButton(actionButtonsContainer);
            addRemoveButton(actionButtonsContainer);
            createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, section, sectionId);
        } else {
            showErrorMessage(clockBodyDiv);
            appendUnsetButton(availabilityContainer, actionButtonsContainer, clockFooterDiv, clockModalDiv, clockBodyDiv, section, sectionId);
            clockButton.style.backgroundColor = 'yellow';
        }
    });
}

function changeSectionClockIcon(sectionRow, sectionId) {
    var section = getSection(jsonData, sectionId);
    const clockButton = sectionRow.querySelector('.sectionButton.clockButton');

    if (compareDailySpecialHours(section) && section?.MenuItems?.[0]?.DailySpecialHours?.length > 1) {
        clockButton.style.backgroundColor = '#80d66f';
    } else {
        clockButton.style.backgroundColor = ''; // Revert back to default or set a specific color
    }
}

function addSaveChangesButton(parentElement) {
    const clockSaveBtn = createAndAppend(parentElement, 'button', 'clockBtn', 'clockBtn-save');
    addTextContent(clockSaveBtn, 'Save Changes');
    return clockSaveBtn;
 }

 function addRemoveButton(parentElement) {
    const clockRemoveBtn = createAndAppend(parentElement, 'button', 'clockBtn', 'removeBtn');
    addTextContent(clockRemoveBtn, 'Remove');
}

function createSectionTableRows(parentElement, menuSection) {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    const areDailySpecialHoursSame = compareDailySpecialHours(menuSection);
    const timesMapping = {};

    // If all DailySpecialHours are the same for all MenuItems, then take the DailySpecialHours data 
    if ( areDailySpecialHoursSame && menuSection.MenuItems.length > 0 && menuSection.MenuItems[0].DailySpecialHours ) 
        { 
            menuSection.MenuItems[0].DailySpecialHours.forEach(time => {
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
    const sectionRow = document.getElementById(sectionId);
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            MenuSection.MenuItems.forEach(MenuItem => {
                const itemRow = document.getElementById(MenuItem.MenuItemId);
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
                if( itemRow != null) {changeItemClockIcon(itemRow, MenuItem.MenuItemId);}
            });
            updateLocalStorage();
        }
    });
    changeSectionClockIcon(sectionRow, sectionId);
}

function getSection(jsonData, sectionId) {
    const foundSection = jsonData.MenuSections.find(MenuSection => MenuSection.MenuSectionId == sectionId);
    if (foundSection) {
        return foundSection;
    }
    return null;
}

function compareDailySpecialHours(menuSection) {
    if (!menuSection?.MenuItems || menuSection?.MenuItems?.length <= 1) {
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

function showErrorMessage(parentElement) {
    const errorMessage = "Menu items don't have the same schedule table, it's not possible to place a schedule in the section";
    const errorMsgElement = createAndAppend(parentElement, 'p', 'error-message-class'); 
    errorMsgElement.textContent = errorMessage;
}

function appendUnsetButton(availabilityContainer, actionButtonsContainer, clockFooterDiv, clockModalDiv, clockBodyDiv, section, sectionId) {
    const unsetButton = createAndAppend(clockFooterDiv, 'button');
    unsetButton.textContent = "Unset - Click to reset";
    unsetButton.classList.add('clockBtn-unsetButton');

    unsetButton.addEventListener('click', function() {
        event.stopPropagation();
        unsetButton.remove();
        const errorMsgElement = document.querySelector('.error-message-class');
        if (errorMsgElement) {
            errorMsgElement.remove();
        }
        const clockSaveBtn = addSaveChangesButton(actionButtonsContainer);
        addSectionAvailabilityButton(availabilityContainer, section);
        addRemoveButton(actionButtonsContainer);
        createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, section, sectionId);
        const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
        processSaveChanges(tableRows, section, sectionId, clockFooterDiv);
        resetClockIcons(sectionId);
    });
}

function resetClockIcons(sectionId) {
    const sectionRow = document.getElementById(sectionId);
    const clockButton = sectionRow.querySelector('.sectionButton.clockButton');
    clockButton.style.backgroundColor = ''; // Revert back to default or set a specific color
}

export {
    sectionClockButton,
    createSectionTableRows,
    storeSectionTimeTableInJson,
    compareDailySpecialHours,
    changeSectionClockIcon
} 
