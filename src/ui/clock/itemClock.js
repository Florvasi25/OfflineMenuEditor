import { 
    jsonData, 
    getRandomInt,
    updateLocalStorage,
    getSectionRow
} from '../context.js'

import {
    createClockBody,
    createClockTable,
    createInputCell,
    dayMappingToName,
    removeItemTimetable,
    checkCloseTimeKey
} from './clockUtils.js'

import {
    changeSectionClockIcon
} from './sectionClock.js'
import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import { slotManagerInstance } from '../mainContainer.js';

function itemClockButton(leftItemContainer, itemId, sectionId) {
    const clockButton = createAndAppend(leftItemContainer, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';
    clockButton.addEventListener('click', () => {
        const clockElements = createClockBody();
        const clockModalDiv = clockElements.clockModalDiv;
        const clockFooterDiv = clockElements.clockFooterDiv;
        const clockBodyDiv = clockElements.clockBodyDiv;
        const clockTitle = clockElements.clockTitle;
        const actionButtonsContainer = createAndAppend(clockFooterDiv, 'div', 'action-buttons');
        const clockSaveBtn = createAndAppend(actionButtonsContainer, 'button', 'clockBtn', 'clockBtn-save');
        addTextContent(clockSaveBtn, 'Save Changes');
        addTextContent(clockTitle, 'Menu Item Hours');
       
        const item = getItem(jsonData, itemId); 
        createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, item, itemId);
        addRemoveButton(clockModalDiv, actionButtonsContainer, item, itemId, sectionId);
    });
}

function createItemTableRows(parentElement, item) {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    const timesMapping = {};
    checkCloseTimeKey(item.DailySpecialHours)
    item.DailySpecialHours.forEach(time => {
        timesMapping[time.DayOfWeek] = {
            start: time.StartTime,
            close: time.CloseTime
        };
    });

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
function storeItemTimeTableInJson(DayOfWeek, StartTime, CloseTime, Period, id) {
    const itemRow = document.getElementById(id);
    var sectionOfItem;
    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            if(item.MenuItemId == id) {
                sectionOfItem = section;
                if(!item.DailySpecialHours) {
                    item.DailySpecialHours = [];
                }   
                // Remove any object from DailySpecialHours that has the same DayOfWeek 
                // as the object we are pushing, to avoid duplicated objects.
                item.DailySpecialHours = 
                    item.DailySpecialHours.filter(time => time.DayOfWeek !== DayOfWeek);    
                // If it's the first object, get a random ID,
                // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in DailySpecialHours, 
                // determines the highest value using Math.max, and adds +1. 
                let Id = (item.DailySpecialHours.length === 0) ? 
                    getRandomInt() : 
                    Math.max(...item.DailySpecialHours.map(items => items.BusinessHoursPeriodId)) + 1;    
                // Create the new time object
                const newTime = {
                    BusinessHoursPeriodId: Id,
                    DayOfWeek,
                    StartTime,
                    CloseTime,
                    Period,
                    StartTimeEarly: StartTime,
                    PeriodEarly: "00:00"
                };
                // Push the new time to the array
                item.DailySpecialHours.push(newTime);
            }
    })})
    const sectionRow = getSectionRow(sectionOfItem.MenuSectionId);
    updateLocalStorage(slotManagerInstance.currentSlot);
    changeItemClockIcon(itemRow, id);
    changeSectionClockIcon(sectionRow, sectionOfItem.MenuSectionId);
}


function addRemoveButton(clockModalDiv, parentElement, item, itemId, sectionId) {
    const clockRemoveBtn = createAndAppend(parentElement, 'button', 'clockBtn', 'removeBtn');
    addTextContent(clockRemoveBtn, 'Remove');
    const itemRow = document.getElementById(itemId);
    if (item.DailySpecialHours?.length > 1) {
        clockRemoveBtn.classList.remove('removeBtn-disabled');
        clockRemoveBtn.classList.add('removeBtn');
    } 
    else { 
        clockRemoveBtn.classList.remove('removeBtn');
        clockRemoveBtn.classList.add('removeBtn-disabled'); 
    }

    clockRemoveBtn.addEventListener('click', () => {
        if (clockRemoveBtn.classList.contains('removeBtn-disabled')) { return; }
        if(removeItemTimetable(item)) { 
            const sectionRow = getSectionRow(sectionId);
            clockModalDiv.style.display = 'none'; 
            changeItemClockIcon(itemRow, itemId)
            changeSectionClockIcon(sectionRow, sectionId);
        }
    });

}

function changeItemClockIcon(itemRow, itemId) {
    var item = getItem(jsonData, itemId);
    const clockButton = itemRow.querySelector('.sectionButton.clockButton');

    if (item?.DailySpecialHours?.length > 1) {
        clockButton.style.backgroundColor = '#54f234';
    } else {
        clockButton.style.backgroundColor = ''; // Revert back to default or set a specific color
    }
}


function getItem(jsonData, itemId) {
    if (!jsonData || !jsonData.MenuSections) return null;
    for (let section of jsonData.MenuSections) {
        const foundItem = section.MenuItems && section.MenuItems.find(MenuItem => MenuItem.MenuItemId == itemId);
        if (foundItem) {
            return foundItem;
        }
    }
    return null;
}

export {
    itemClockButton,
    createItemTableRows,
    storeItemTimeTableInJson,
    changeItemClockIcon
}