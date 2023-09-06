// import {
//     jsonData,
//     getSectionIndex,
//     updateCounterLocalStorage,
//     updateSectionLocalStorage,
// } from './context.js';

function sectionClockButton(sectionButtonsCell) {
    const clockButton = document.createElement('button');
    clockButton.classList.add('sectionButton')
    clockButton.classList.add('clockButton')
    sectionButtonsCell.appendChild(clockButton);
    const clockButtonImg = document.createElement('img')
    clockButtonImg.classList.add('sectionButtonImg')
    clockButtonImg.src = '../../assets/clockIcon.svg'
    clockButton.appendChild(clockButtonImg)

    clockButton.addEventListener('click', () => {
        const modalBody = createClockWindow();
        createTable(modalBody);
    });
}
    function createClockWindow()
    {
        // Create the main modal div
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal';
        modalDiv.id = 'exampleModal';

        // Create modal dialog div
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';

        // Create modal content div
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Create header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        const title = document.createElement('h5');
        title.className = 'modal-title';
        title.id = 'exampleModalLabel';
        title.textContent = 'Menu Section Hours';
        const btnClose = document.createElement('span');
        btnClose.className = 'btn-close';
        btnClose.innerHTML = '&times;';
        btnClose.addEventListener('click', () => {
          modalDiv.style.display = 'none';
        });
        modalHeader.appendChild(title);
        modalHeader.appendChild(btnClose);
    
        // Create body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
    
        // Create footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        const btnCloseFooter = document.createElement('button');
        btnCloseFooter.className = 'btn btn-secondary';
        btnCloseFooter.textContent = 'Close';
        btnCloseFooter.addEventListener('click', () => {
          modalDiv.style.display = 'none';
        });
        const btnSave = document.createElement('button');
        btnSave.className = 'btn btn-primary';
        btnSave.textContent = 'Save Changes';
        modalFooter.appendChild(btnCloseFooter);
        modalFooter.appendChild(btnSave);
    
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalDialog.appendChild(modalContent);
        modalDiv.appendChild(modalDialog);
    
        document.body.appendChild(modalDiv);
    
        // Show modal
        modalDiv.style.display = 'block';

        return modalBody;
    }

    function createTable(modalBody)
    {
        // Create table
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table header
        const headers = ['Day', 'Open', 'Close'];
        const headerRow = document.createElement('tr');
        headers.forEach(text => {
          const th = document.createElement('th');
          th.textContent = text;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    
        // Create table body
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach(day => {
          const tr = document.createElement('tr');
          [day, '01:00', '00:00'].forEach((text, index) => {
            const td = document.createElement('td');
            td.textContent = text;
            if(index != 0)
            {
                td.contentEditable = true;
            }
            // Limit text to 5 characters
            td.addEventListener('input', function(event) {
                if (td.textContent.length > 5) {
                  td.textContent = td.textContent.substring(0, 5);
                }
              });
        
            // Optional: Prevent Enter key from adding a new line
            td.addEventListener('keydown', function(event) {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            });
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
    
        // Append table components
        table.appendChild(thead);
        table.appendChild(tbody);
    
        // Add table to modal body
        modalBody.appendChild(table);
    }
export {
    sectionClockButton,
}