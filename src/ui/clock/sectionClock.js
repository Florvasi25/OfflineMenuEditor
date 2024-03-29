import {
    jsonData, 
    getRandomInt, 
    updateLocalStorage,
    getSectionIndex
} from '../context.js'

import {
    removeAvailabilityTimes
} from './sectionAvailability.js'

import {
    createClockBody,
    createClockTable,
    createInputCell,
    dayMappingToName,
    processSaveChanges,
    removeSectionTimetable,
    checkCloseTimeKey
} from './clockUtils.js'

import {
    createDropDownMenu,
    getAvailabilityMode,
    blockTimeTable
} from './collapsedTime.js'

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import { addSectionAvailabilityButton } from "./sectionAvailability.js";

import { changeItemClockIcon } from "./itemClock.js";

import { slotManagerInstance } from '../mainContainer.js';

function sectionClockButton(sectionButtons, sectionId) {
    const clockButton = createAndAppend(sectionButtons, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';
   
    clockButton.addEventListener('click', () => {
        const section = getSection(jsonData, sectionId);  
        const sectionIndex = getSectionIndex(sectionId);
        const clockElements = createClockBody(sectionId, sectionIndex);
        const clockModalDiv = clockElements.clockModalDiv;
        const clockBodyDiv = clockElements.clockBodyDiv;
        const clockFooterDiv = clockElements.clockFooterDiv;
        const clockHeaderBottomDiv = clockElements.clockHeaderBottomDiv;
          
        const availabilityContainer = createAndAppend(clockFooterDiv, 'div', 'availability-container');
        const actionButtonsContainer = createAndAppend(clockFooterDiv, 'div', 'action-buttons');

        if(compareDailySpecialHours(section)) {
            createDropDownMenu(clockHeaderBottomDiv, sectionIndex);
            addSectionAvailabilityButton(availabilityContainer, section);
            const clockSaveBtn = addSaveChangesButton(actionButtonsContainer);
            addRemoveButton(clockModalDiv, actionButtonsContainer, jsonData, sectionId, section);
            createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, section, sectionId, sectionIndex);
            if(section.MenuItems?.[0]?.DailySpecialHours?.length > 1){ clockButton.style.backgroundColor = '#54f234'; }
        } else {
            showErrorMessage(clockBodyDiv);
            appendUnsetButton(clockFooterDiv, clockModalDiv, sectionId);
            clockButton.style.backgroundColor = '#ffee00';
        }
    });
}

function addSaveChangesButton(parentElement) {
    const clockSaveBtn = createAndAppend(parentElement, 'button', 'clockBtn', 'clockBtn-save');
    addTextContent(clockSaveBtn, 'Save Changes');
    return clockSaveBtn;
 }

 function addRemoveButton(clockModalDiv, parentElement, jsonData, sectionId, section) {
    const clockRemoveBtn = createAndAppend(parentElement, 'button', 'clockBtn', 'removeBtn');
    addTextContent(clockRemoveBtn, 'Remove');
    if (section.MenuItems[0]) {
        clockRemoveBtn.classList.remove('removeBtn-disabled');
        clockRemoveBtn.classList.add('removeBtn');
    } 
    else { 
        clockRemoveBtn.classList.remove('removeBtn');
        clockRemoveBtn.classList.add('removeBtn-disabled'); 
    }
    clockRemoveBtn.addEventListener('click', () => {
        if (clockRemoveBtn.classList.contains('removeBtn-disabled')) { return; }
        if(removeSectionTimetable(jsonData, sectionId)) { 
            clockModalDiv.style.display = 'none'; 
            removeAvailabilityTimes(sectionId);
            resetSectionClockIcons(sectionId);
            resetItemsClockIcons(sectionId);
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

}

function createSectionTableRows(parentElement, menuSection, sectionIndex) {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    const areDailySpecialHoursSame = compareDailySpecialHours(menuSection);
    const timesMapping = {};

    const availabilityMode = getAvailabilityMode(sectionIndex);

    
    // If all DailySpecialHours are the same for all MenuItems, then take the DailySpecialHours data 
    if ( areDailySpecialHoursSame && menuSection.MenuItems.length > 0 && menuSection.MenuItems[0].DailySpecialHours ) 
        { 
            checkCloseTimeKey(menuSection.MenuItems[0].DailySpecialHours);
            menuSection.MenuItems[0].DailySpecialHours.forEach(time => {
            timesMapping[time.DayOfWeek] = {
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

    if(availabilityMode == 0 || availabilityMode == 2){
        blockTimeTable();
    }
}

// Store the data in an object and push it to the jsonData local storage
function storeSectionTimeTableInJson(DayOfWeek, StartTime, CloseTime, Period, sectionId) {
    const sectionRow = document.getElementById(sectionId);
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            MenuSection.MenuItems.forEach(MenuItem => {
                const itemRow = document.getElementById(MenuItem.MenuItemId);
                if(!MenuItem.DailySpecialHours) {
                    MenuItem.DailySpecialHours = [];
                }
                // Remove any object from DailySpecialHours that has the same DayOfWeek 
                // as the object we are pushing, to avoid duplicated objects.
                MenuItem.DailySpecialHours = 
                    MenuItem.DailySpecialHours.filter(time => time.DayOfWeek !== DayOfWeek);

                // If it's the first object, get a random ID,
                // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in DailySpecialHours, 
                // determines the highest value using Math.max, and adds +1. 
                let Id = (MenuItem.DailySpecialHours.length === 0) ? 
                    getRandomInt() : 
                    Math.max(...MenuItem.DailySpecialHours.map(item => item.BusinessHoursPeriodId)) + 1;
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
                MenuItem.DailySpecialHours.push(newTime);
                if( itemRow != null) {changeItemClockIcon(itemRow, MenuItem.MenuItemId);}
            });
            updateLocalStorage(slotManagerInstance.currentSlot);
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
        return true; // if there's only one or no items, then they are the same
    }
    const baseHours = menuSection.MenuItems[0].DailySpecialHours;
    for (let i = 1; i < menuSection.MenuItems.length; i++) {
        const currentHours = menuSection.MenuItems[i].DailySpecialHours;
        if (baseHours.length !== currentHours.length) {
            return false; // if the lengths are different, then they're not the same
        }
        for (let j = 0; j < baseHours.length; j++) {
            if (baseHours[j].StartTime !== currentHours[j].StartTime ||
                baseHours[j].Period !== currentHours[j].Period /*||
               baseHours[j].StartTimeEarly !== currentHours[j].StartTimeEarly*/) {
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

function appendUnsetButton(clockFooterDiv, clockModalDiv, sectionId) {
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
        if(removeSectionTimetable(jsonData, sectionId)) { 
            clockModalDiv.style.display = 'none'; 
            removeAvailabilityTimes(sectionId);
            resetSectionClockIcons(sectionId);
            resetItemsClockIcons(sectionId);
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
        
        /*const clockSaveBtn = addSaveChangesButton(actionButtonsContainer);
        addSectionAvailabilityButton(availabilityContainer, section);
        addRemoveButton(clockModalDiv, actionButtonsContainer, jsonData, sectionId, section);
        createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, section, sectionId, sectionIndex);
        createDropDownMenu(clockHeaderBottomDiv, sectionIndex);

        const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
        processSaveChanges(tableRows, section, sectionId, clockFooterDiv, sectionIndex);
        resetSectionClockIcons(sectionId);
        resetItemsClockIcons(sectionId);

        updateLocalStorage(slotManagerInstance.currentSlot);
        clockModalDiv.style.display = 'none';*/
    });
}

function changeSectionClockIcon(sectionRow, sectionId) {
    var section = getSection(jsonData, sectionId);
    if( section != null){
        var compareHours = compareDailySpecialHours(section);
        var hoursLengthIsSame = checkHoursLength(section);
        if (compareHours && hoursLengthIsSame) {
            changeSectionClockIconColor(sectionRow, '#54f234');
        }else if (!compareHours && hoursLengthIsSame){
            changeSectionClockIconColor(sectionRow, '#ffdf00');
        } else {
            changeSectionClockIconColor(sectionRow, '');
        }
    }
}

function checkHoursLength(section){
    for(let i = 0; i < section.MenuItems.length; i++){
        if(section?.MenuItems?.[i]?.DailySpecialHours?.length > 0){
            return true;
        }
    }
    
}
function changeSectionClockIconColor(sectionRow, color){
    // console.log(sectionRow);
    const clockButton = sectionRow.querySelector('.sectionButton.clockButton');
    // console.log(clockButton);
    clockButton.style.backgroundColor = color;
}

function getsectionClockColor(sectionRow){
    const clockButton = sectionRow.querySelector('.sectionButton.clockButton');
    return clockButton.style.backgroundColor;
    
}
function resetSectionClockIcons(sectionId) {
    const sectionRow = document.getElementById(sectionId);
    const clockButton = sectionRow.querySelector('.sectionButton.clockButton');
    clockButton.style.backgroundColor = ''; 
}

function resetItemsClockIcons(sectionId) {
    const sectionRow = document.getElementById(sectionId);

    if( sectionRow.className === "sectionRow draggable expanded" || 
            sectionRow.className === "sectionRow draggable unavailable expanded"){

        const itemTable = sectionRow.nextElementSibling; 
        const itemRows = itemTable.getElementsByClassName('itemRow');
        for (const itemRow of itemRows) {
            const clockButton = itemRow.querySelector('.sectionButton.clockButton');
            clockButton.style.backgroundColor = '';
        }
    }
}

export {
    sectionClockButton,
    createSectionTableRows,
    storeSectionTimeTableInJson,
    compareDailySpecialHours,
    changeSectionClockIcon,
    changeSectionClockIconColor,
    getsectionClockColor
} 
