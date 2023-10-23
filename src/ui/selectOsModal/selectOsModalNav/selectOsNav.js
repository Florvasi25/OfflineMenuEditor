
function createSelectOsModalNav() {
    const selectOsModalNav = document.createElement('div')
    selectOsModalNav.className = 'selectOsModalNav'

    const { closeBtnRow, closeOsModalBtn } = createCloseBtnRow()
    selectOsModalNav.appendChild(closeBtnRow)

    return { selectOsModalNav, closeOsModalBtn }
}

function createCloseBtnRow() {
    const closeBtnRow = document.createElement('div')
    closeBtnRow.className = 'closeBtnRow'

    const closeOsModalBtn = createCloseOsModalBtn()
    closeBtnRow.appendChild(closeOsModalBtn)

    return { closeBtnRow, closeOsModalBtn }
}

function createCloseOsModalBtn() {
    const closeOsModalBtn = document.createElement('button')
    closeOsModalBtn.className = 'closeOsModalBtn'
    closeOsModalBtn.id = 'closeOsModalBtn'
    closeOsModalBtn.textContent = 'X'

    return closeOsModalBtn
}

export { createSelectOsModalNav }