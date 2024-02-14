import { 
    updateLocalStorage,
    jsonData
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function removeTax(savedTaxContainer, removeTaxButton, taxRate) {
    if (removeTaxButton.id == taxRate.TaxRateId) {
        confirmDelete(savedTaxContainer, taxRate)
    }
}

function confirmDelete(savedTaxContainer, taxRate) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${taxRate.Name}: ${taxRate.Rate}%"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        removeTaxFromMenu(savedTaxContainer, taxRate)

        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    savedTaxContainer.appendChild(popup);

    //Close the delete popup when clicked outside
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup")) {
            e.target.remove();
        }
    });

    //Close the delete popup when pressed "Esc"
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const popup = document.querySelector(".popup");
            if (popup !== null) {
                popup.remove();
            }
        }
    });
}

function removeTaxFromMenu(savedTaxContainer, taxRate) {
    jsonData.TaxRates = jsonData.TaxRates.filter(tax => tax.TaxRateId !== taxRate.TaxRateId);
    savedTaxContainer.remove();
    
    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            if (item.TaxRateId == taxRate.TaxRateId) {
                item.TaxRateId = null;
            }
            item.MenuItemOptionSets.forEach(os => {
                os.MenuItemOptionSetItems.forEach(option => {
                    if (option.TaxRateId == taxRate.TaxRateId) {
                        option.TaxRateId = null;
                    }
                });
            });
        });
    });

    const itemTaxPreviewArray = Array.from(document.getElementsByClassName('itemTax'));
    itemTaxPreviewArray.forEach(itemTaxPreview => {
        if (itemTaxPreview && itemTaxPreview.id == taxRate.TaxRateId) {
            itemTaxPreview.textContent = '0%'
        }
    })

    const optionTaxPreviewArray = Array.from(document.getElementsByClassName('optionTaxPreview'));
    optionTaxPreviewArray.forEach(optionTaxPreview => {
        if (optionTaxPreview && optionTaxPreview.id == taxRate.TaxRateId) {
            optionTaxPreview.textContent = '0%'
        }
    })

    updateLocalStorage(slotManagerInstance.currentSlot)
}

export { removeTax }