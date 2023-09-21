const openOsModalBtn = document.getElementById('openOsModalBtn');
const closeOsModalBtn = document.getElementById('closeOsModalBtn');
const osModalContainer = document.getElementById('myModal');

openOsModalBtn.addEventListener('click', () => {
    osModalContainer.style.display = 'block';
    setTimeout(() => {
        osModalContainer.classList.add('show');
    }, 10);
});

closeOsModalBtn.addEventListener('click', () => {
    osModalContainer.classList.remove('show');
    osModalContainer.classList.add('hide'); 
    setTimeout(() => {
        osModalContainer.style.display = 'none'; 
        osModalContainer.classList.remove('hide'); 
    }, 300);
});
