import { osDeleteButton } from './osDelete.js'

import { osDuplicateButton } from './osDuplicate.js'

import { osNewButton } from './osAddNew.js'

import { osCaseButton } from './osCase.js'

function createOsBtnsCell(menuOs) {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osCaseButton(osBtnsCell)
    
    osNewButton(osBtnsCell, menuOs)

    osDeleteButton(osBtnsCell, menuOs)

    osDuplicateButton(osBtnsCell, menuOs)

    return osBtnsCell
}

export { createOsBtnsCell }