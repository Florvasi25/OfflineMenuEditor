import { osDeleteButton } from './osDelete.js'

import { osDuplicateButton } from './osDuplicate.js'

import { osNewButton } from './osAddNew.js'

import { osExpandListButton } from './osExpandList.js'

function createOsBtnsCell(menuOs) {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osExpandListButton(osBtnsCell, menuOs)
    
    osNewButton(osBtnsCell, menuOs)

    osDeleteButton(osBtnsCell, menuOs)

    osDuplicateButton(osBtnsCell, menuOs)

    return osBtnsCell
}

export { createOsBtnsCell }