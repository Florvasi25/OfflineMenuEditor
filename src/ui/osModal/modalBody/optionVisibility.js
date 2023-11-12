import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessOsKey,
    updateOsDomIds,
    updateOptionDomIds,
} from "../../context.js";

function optionVisibilityButton(
    optionButtonsCell,
    optionRow,
    menuOption,
    menuOs
) {
    const visibilityButton = document.createElement("button");
    visibilityButton.classList.add("sectionButton");
    visibilityButton.classList.add("visibilityButton");
    visibilityButton.addEventListener("click", () => {
        SectionAvailability(optionRow, menuOs, menuOption);
    });
    optionButtonsCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement("img");
    visibilityButtonImg.classList.add("sectionButtonImg");
    visibilityButtonImg.src = "../../assets/visibilityIcon.svg";
    visibilityButton.appendChild(visibilityButtonImg);

    //Unavailable Sections - Gray
    if (!menuOption.IsAvailable) {
        optionRow.classList.add("unavailable");
        visibilityButton.classList.add("hiddenSection");
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener("click", () => {
        if (!menuOption.IsAvailable) {
            visibilityButton.classList.add("hiddenSection");
        } else {
            visibilityButton.classList.remove("hiddenSection");
        }
    });
}

//Section Availability
function SectionAvailability(optionRow, menuOs, menuOption) {
    const optionToHide = optionRow.id;
    const oldGroupOsId = menuOs.groupOsId;
    const oldGroupOptionId = menuOption.groupOptionId;

    if (optionToHide) {
        if (groupedOs[oldGroupOsId]) {
            groupedOs[oldGroupOsId].forEach((os) => {
                const option = os.MenuItemOptionSetItems.find(
                    (option) => option.groupOptionId == optionToHide
                );
                optionRow.classList.toggle("unavailable", option.IsAvailable);
                option.IsAvailable = !option.IsAvailable;
            });
            groupOptionSets();
            updateLocalStorage();

            updateOptionDomIds(menuOption, oldGroupOptionId);
            updateOsDomIds(menuOs, oldGroupOsId);
        } else if (itemlessOs[oldGroupOsId]) {
            const option = itemlessOs[oldGroupOsId].MenuItemOptionSetItems.find(
                (option) => option.groupOptionId == optionToHide
            );
            optionRow.classList.toggle("unavailable", option.IsAvailable);
            option.IsAvailable = !option.IsAvailable;
            updateItemlessOsKey(oldGroupOsId);
        }
    }
}

export { optionVisibilityButton };
