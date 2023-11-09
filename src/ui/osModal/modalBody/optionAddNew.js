import { createOption } from "./osBody.js";

import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    getUniqueRandomInt,
    groupedOs,
    setColorOfRows,
    itemlessOs,
    updateGroupedIdItemlessOs,
} from "../../context.js";

import { createOptionRow } from "../../optionSet/osOptionsContainer.js";

function createOptionButton(optionRowsContainer, menuOs) {
    const newOptionButton = document.createElement("button");
    newOptionButton.className = "optionAddNew";
    newOptionButton.textContent = "New Option";

    //Add Section
    newOptionButton.addEventListener("click", () => {
        handleClickNewOptionButton(optionRowsContainer, menuOs);
    });

    return newOptionButton;
}

function handleClickNewOptionButton(optionRowsContainer, menuOs) {
    let emptyOptionJson = {
        CatalogItemId: null,
        MenuId: jsonData.MenuId,
        MenuItemOptionSetItemId: null,
        Name: null,
        Price: 0,
        TaxRateId: null,
        TaxRate: null,
        TaxValue: 0,
        TaxRateName: null,
        IsAvailable: true,
        DisplayOrder: menuOs.MenuItemOptionSetItems.length,
        IsDeleted: false,
        Tags: [],
        NextMenuItemOptionSetId: null,
        PublicId: crypto.randomUUID(),
        ImageName: null,
        ImageUrl: null,
        CellAspectRatio: 0,
        CellLayoutType: 0,
        OptionSetItemMetadata: [],
        ExternalImageUrl: null,
        groupOptionId: crypto.randomUUID(),
    };

    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach((os) => {
            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);
            updateItemCounterLocalStorage(newOptionId, true);

            emptyOptionJson.MenuItemOptionSetItemId = newOptionId;

            os.MenuItemOptionSetItems.push(emptyOptionJson);

        });

        const optionContainerPreviewArray = Array.from(
            document.getElementsByClassName("optionContainer")
        );

        const optionContainerPreview = optionContainerPreviewArray.filter(
            (element) => {
                const groupOsId = element.getAttribute("groupOsId");
                return groupOsId === menuOs.groupOsId;
            }
        );

        if (optionContainerPreview) {
            optionContainerPreview.forEach((osRowOptionContainerPreview) => {
                const newOptionRow = createOptionRow(emptyOptionJson);
                osRowOptionContainerPreview.appendChild(newOptionRow);
            });
        }

        updateLocalStorage();
    } else if (itemlessOs[menuOs.groupOsId]) {
        const optionIds = getLocalStorageOptionSetItemsIDs();
        const newOptionId = getUniqueRandomInt(optionIds);
        updateItemCounterLocalStorage(newOptionId, true);

        emptyOptionJson.MenuItemOptionSetItemId = newOptionId;

        itemlessOs[menuOs.groupOsId].MenuItemOptionSetItems.push(
            emptyOptionJson
        );

        updateGroupedIdItemlessOs(menuOs);
    } else {
        console.log("error");
    }

    const optionRow = createOption(
        optionRowsContainer,
        menuOs,
        emptyOptionJson
    );

    optionRowsContainer.appendChild(optionRow);

    setColorOfRows(optionRowsContainer);
}

export { createOptionButton };
