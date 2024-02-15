import { emptyMenu } from '../emptyMenu.js'

import { updateJsonData } from '../context.js'

import { generateHTML, 
    createBtnContainers, 
    createLeftContainer, 
    createTaxContainer 
} from '../mainContainer.js';

export class SlotManager {
    constructor() {
        this.currentSlot = 'jsonDataSlot1';
        this.currentItemlessOs = 'itemlessOsSlot1';
        this.currentSlotName = 'Slot 1';
        createBtnContainers();
        createLeftContainer();
        this.bindSlotButtonEvents();
    }

    bindSlotButtonEvents() {
        const slotButtons = document.querySelectorAll('.slotBtn');
        slotButtons.forEach(button => {

            button.addEventListener('click', event => {
                const slotNumber = event.target.id.replace('slotButton', '');
                const itemlessOsNumber = slotNumber;
                this.changeWorkspace(`jsonDataSlot${slotNumber}`, `itemlessOsSlot${itemlessOsNumber}`, `Slot ${slotNumber}`);
            });

            button.addEventListener('blur', function () {
                localStorage.setItem(button.id, button.textContent);
            });

        });
    }

    changeWorkspace(jsonDataSlot, itemlessOsName, slotName) {
        this.currentSlot = jsonDataSlot;
        this.currentItemlessOs = itemlessOsName;
        this.currentSlotName = slotName;
        console.log("SLOT: ", this.currentSlot, " Itemless: ", this.currentItemlessOs);
        this.updateWorkspace();
    }

    updateWorkspace() {
        let jsonData = this.getJsonData();
        updateJsonData(jsonData);
        generateHTML(jsonData);
        createTaxContainer(jsonData);
        this.changeSlotTitle();
    }

    getJsonData() {
        return JSON.parse(localStorage.getItem(this.currentSlot)) ?? emptyMenu;
    }

    saveJsonData(jsonData) {
        localStorage.setItem(this.currentSlot, JSON.stringify(jsonData));
    }

    changeSlotTitle() {
        var slotTitle = document.getElementsByClassName('slotTitle')[0];
        slotTitle.innerText = this.currentSlotName;
    }
}
