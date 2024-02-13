import { 
    updateLocalStorage,
    jsonData
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function removeTax(savedTaxContainer, removeTaxButton, taxRate) {
    if (removeTaxButton.id == taxRate.TaxRateId) {
        jsonData.TaxRates = jsonData.TaxRates.filter(tax => tax.TaxRateId !== taxRate.TaxRateId);
        updateLocalStorage(slotManagerInstance.currentSlot)
        savedTaxContainer.remove();
    }
}

export { removeTax }