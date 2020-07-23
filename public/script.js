const addListInput = document.getElementById('add-list-input');
const addListPlus = document.getElementById('add-list-plus');
const addListCurrent = document.getElementById('add-list-current');
const showListHeading = document.getElementById('show-list-heading');
const showListItems = document.getElementById('show-list-items');
const showListPlus = document.getElementById('show-list-plus');
const showListInput = document.getElementById('show-list-input');


const state = {
    stateLists: [],
    activeListId: ''
};

function setActiveListId(id) {
    state.activeListId = id;
}

function getActiveListId() {
    return state.activeListId;
}


class Data {
    constructor(heading, items) {
        this.heading = heading;
        this.items = items;
    };

    setData(heading, items) {
        localStorage.setItem(heading, items);
        const newItem = {
            heading: heading,
            items: items,
        };
        state.stateLists.push(newItem);
        return newItem;
    }

    //Clear Input Element
    clearInput() {
        addListInput.value = '';
    }

    displayHeading() {
        const addListNew = document.createElement('li');
        addListNew.classList.add('add-list-current-item');
        addListNew.id = `${this.heading}`;
        addListNew.innerHTML = `${this.heading} <button class=" fas fa-trash delete-btn" onclick="removeList('${this.heading}')"></button>`;
        addListCurrent.appendChild(addListNew);
        setAddListActive(addListNew);

    }
}

function setAddListActive(eTarget) {
    //Add List Container
    const containsClass = 'add-list-current-item';
    const addClass = 'active';
    if (eTarget.classList.contains(containsClass)) {
        let getActive = document.querySelector(`.${addClass}`);
        if (getActive !== null) {
            getActive.classList.remove(addClass);
        }
        eTarget.classList.toggle(addClass);
        setActiveListId(eTarget.id);
        displayShowContainer(getActiveListId());
    }
}

//select active list
addListCurrent.addEventListener('click', (e) => {
    setAddListActive(e.target)
});


//Store the data in local storage and display heading
addListPlus.addEventListener('click', () => {
    //CHeck if List input value is not empty
    if (addListInput.value !== '') {
        newListHeading = new Data(addListInput.value, '');

        //check if heading is already in local storage
        if (localStorage.getItem(addListInput.value) === null) {

            newListHeading.setData(addListInput.value, '');
            newListHeading.displayHeading();
            setActiveListId(addListInput.value);
            newListHeading.clearInput();
            console.log(state)
        } else {
            window.alert(`You already have a list called ${addListInput.value}`)
        };
    } else {
        alert('Please enter a name for your list');
    }
});


//Display the Heading & items on Show Container
const displayShowContainer = (id) => {
    //Show heading
    let currentList = state.stateLists.find((arr) => arr.heading === id);
    showListHeading.innerHTML = currentList.heading;

    //Clear showListItems
    showListItems.innerHTML = '';

    //Show Items
    if (!currentList.items == '') {
        let itemsToArray = currentList.items.split(',');
        itemsToArray.forEach(e => {
            const showListNew = document.createElement('div');
            showListNew.classList.add('show-list-item');
            showListNew.id = e.trim();
            let heads = id;
            showListNew.innerHTML =
                `
            <label><input type="checkbox" class="list-item">${e}</label>
                    <button class="fas fa-trash delete-btn" 
                    onclick="removeItem('${heads}','${showListNew.id}')"</button>
                `;
            showListItems.appendChild(showListNew);
        });
    }
}

function removeItem(idHeading, idItem) {
    //find index in stateList
    let indexOfActiveList = state.stateLists.findIndex(((arr) => (arr.heading === idHeading)));

    //update the items in stateList
    let itemsToArray = state.stateLists[indexOfActiveList].items.split(', ');
    let indexOfId = itemsToArray.findIndex(id => id === idItem);
    if (indexOfId !== -1) {
        itemsToArray.splice(indexOfId, 1);
        itemsToArrayBackToString = itemsToArray.join(', ')

        //Update state of state lists
        updated = { heading: idHeading, items: itemsToArrayBackToString };
        state.stateLists[indexOfActiveList] = updated;

        //Update local Storage
        localStorage.setItem(idHeading, itemsToArrayBackToString)

        //display in UI
        displayShowContainer(idHeading);
    }
};

function removeList(id) {
    let indexOfActiveList = state.stateLists.findIndex(((arr) => (arr.heading === id)));

    state.stateLists.splice(indexOfActiveList, 1);
    localStorage.removeItem(id);
    location.reload();
}

//Add Items to chosen List
showListPlus.addEventListener('click', () => {
    //Current ID(heading)
    let activeId = getActiveListId();
    if (activeId !== '') {

        //get current index of element in state
        let indexOfActiveList = state.stateLists.findIndex(((arr) => (arr.heading === activeId)));

        //get current element in localStorage
        let objLocalStorage = localStorage.getItem(activeId);
        const items = objLocalStorage;

        //get input
        const input = showListInput.value;

        //add new Input to items
        let updatedItems = undefined;
        if (objLocalStorage === '') {
            updatedItems = input;
        } else {
            updatedItems = objLocalStorage + ', ' + input;
        }

        //change element in state
        const updatedStateObject = { heading: activeId, items: updatedItems };
        state.stateLists.splice(indexOfActiveList, 1, updatedStateObject);

        //change element in local storage
        localStorage.setItem(activeId, updatedItems);

        //delete input  
        showListInput.value = '';

        //Display in UI
        displayShowContainer(activeId);
    } else {
        //If no List exists
        alert('Please create first a list')
    }
});

//Restore ToDo Lists on page load
window.addEventListener('load', () => {
    for (let i = 0; i < localStorage.length; i++) {
        //Get data from local storage
        let heading = localStorage.key(i);
        console.log(heading, i)
        let item = localStorage.getItem(heading);
        let data = new Data(heading, item);

        //save data in state
        data.setData(heading, item);
        console.log(state)

        //display data
        data.displayHeading();
    }

    //set Current Object
    if (state.stateLists.length) {
        setActiveListId(state.stateLists[state.stateLists.length - 1].heading);
    }
})





