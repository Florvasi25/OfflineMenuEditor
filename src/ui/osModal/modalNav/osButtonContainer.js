import {
    osDeleteButton
} from './osDelete.js'

import {
    osDuplicateButton
} from './osDuplicate.js'

import {
    osNewButton
} from './osAddNew.js'

import {
    osCaseButton
} from './osCase.js'

function createOsBtnsCell() {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osNewButton(osBtnsCell)

    osCaseButton(osBtnsCell)

    osDeleteButton(osBtnsCell)

    osDuplicateButton(osBtnsCell)

    return osBtnsCell
}

export { createOsBtnsCell }