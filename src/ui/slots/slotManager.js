import { emptyMenu } from '../emptyMenu.js'
import { jsonData } from '../context.js'
import { generateHTML, createBtnContainers, createLeftContainer } from '../mainContainer.js';

export class SlotManager {
    constructor() {
      this.currentSlot = 'jsonDataSlot1';
      this.currentItemlessOs = 'itemlessOsSlot1'; 
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
            this.changeWorkspace(`jsonDataSlot${slotNumber}`, `itemlessOsSlot${itemlessOsNumber}`);
          });
      });
    }
  
    changeWorkspace(slotName, itemlessOsName) {
      this.currentSlot = slotName;
      this.currentItemlessOs = itemlessOsName;
      console.log("SLOT: ", this.currentSlot, " Itemless: ", this.currentItemlessOs);
      this.updateWorkspace();
    }
  
    updateWorkspace() {
      let jsonData = this.getJsonData();
      console.log("SLOT: ", jsonData); 
      generateHTML(jsonData);
    }
  
    getJsonData() {
      return JSON.parse(localStorage.getItem(this.currentSlot)) ?? emptyMenu;
    }

    saveJsonData(jsonData) {
      localStorage.setItem(this.currentSlot, JSON.stringify(jsonData));
    }
  }
