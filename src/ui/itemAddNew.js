import { jsonData } from './context.js'
function addItems(ItemsContainer, sectionRow)
{
    ItemsContainer = document.createElement('div');
    ItemsContainer.classList.add('ItemsContainer');
    for (let section of jsonData.MenuSections) {
        if (section.MenuItems && sectionRow.id == section.MenuSectionId) {
            for (let item of section.MenuItems) {
                const contentParagraph = document.createElement('p');
                contentParagraph.textContent = item.Name;
                ItemsContainer.appendChild(contentParagraph);
                sectionRow.parentNode.insertBefore(ItemsContainer, sectionRow.nextSibling);
            }
        }
    }
}

export {addItems}