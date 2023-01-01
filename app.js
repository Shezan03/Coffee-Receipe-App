//query selector
const receipeForm = document.querySelector('#receipe-form');
const receipeContainer = document.querySelector('#receipe-container');
let listItem = [];

//Function
function handleFormSubmit(e){
    e.preventDefault();
    const name = DOMPurify.sanitize(receipeForm.querySelector('#name').value);
    const method = DOMPurify.sanitize(receipeForm.querySelector('#method').value);
    const roast = DOMPurify.sanitize(receipeForm.querySelector('#roast').value);
    const grind = DOMPurify.sanitize(receipeForm.querySelector('#grind').value);
    const ratio = DOMPurify.sanitize(receipeForm.querySelector('#ratio').value);
    const note = DOMPurify.sanitize(receipeForm.querySelector('#note').value);
    const newReceipe = {
        name,
        method,
        roast,
        grind,
        ratio,
        note,
        id: Date.now(),
    }
    listItem.push(newReceipe);
    e.target.reset();
    receipeContainer.dispatchEvent(new CustomEvent('refreshReceipes'));

}

function displayReceipe(){
    const tempString = listItem.map(item => `
    <div class="col">
        <div class="card mb-4 rounded-3 shadow-3 border-primary border-2">
            <div class="card-header py-3 text-white bg-primary border-primary">
             <h4 class="my-0">${item.name}</h4>   
            </div>

            <div class="card-body">
                <ul class="text-start">
                    <li><strong>Method: </strong>${item.method}</li>
                    <li><strong>Roast: </strong>${item.roast}</li>
                    <li><strong>Grind: </strong>${item.grind}</li>
                    <li><strong>Ratio: </strong>${item.ratio}</li>
                    ${!item.note.length ? "" : `<li><strong>Note: </strong>${item.note}</li>`}
                </ul>

            <button class="btn btn-lg btn-outline-danger" aria-label="Delete ${item.name}" value="${item.id}">Delete Receipe</button>
            </div>
        </div>                     
    </div>

    `).join('');
    receipeContainer.innerHTML= tempString;
}

//Save to local stroage
function mirrorStateToLocalStorage(){
    localStorage.setItem('receipeContainer.list', JSON.stringify(listItem));
}

//Display from local stoage
function loadinitialUI(){
    const tempLocalStorage = localStorage.getItem('receipeContainer.list');
    if(tempLocalStorage === null || tempLocalStorage === []) return;
    const tempReceipes = JSON.parse(tempLocalStorage);
    listItem.push(...tempReceipes);
    receipeContainer.dispatchEvent(new CustomEvent('refreshReceipes'));
}

//delete receipe
function deleteReceipeFromList(id){
    listItem = listItem.filter(item=> item.id!== id);
    receipeContainer.dispatchEvent(new CustomEvent('refreshReceipes'));
}


//Event Listener
receipeForm.addEventListener('submit', handleFormSubmit);
receipeContainer.addEventListener('refreshReceipes', displayReceipe);
receipeContainer.addEventListener('refreshReceipes', mirrorStateToLocalStorage);
window.addEventListener('DOMContentLoaded', loadinitialUI);
receipeContainer.addEventListener('click', (e)=>{
   if (e.target.matches('.btn-outline-danger')){

    deleteReceipeFromList(Number(e.target.value));

   };
});