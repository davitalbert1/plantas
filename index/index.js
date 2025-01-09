const modal = document.getElementById('modal');
const addPlantButton = document.getElementById('add-plant-button');
const content = document.getElementById('content');
const closeModalButton = document.getElementById('confirmar');
const confirmAddButton = document.getElementById('confirm-add');
const close = document.getElementById('close');
const plantasList = document.getElementById('plantas-list');

addPlantButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    content.style.display = 'flex';
});
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    content.style.display = 'none';
});
close.addEventListener('click', () => {
    modal.style.display = 'none';
    content.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        content.style.display = 'none';
    }
});
function perfil(){
    window.open("../perfil/perfil.html", "_self");
}