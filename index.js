const displayMessage = (msg, interval=2500) => {
    document.getElementById('message').innerHTML = msg
    setTimeout(() => {
        document.getElementById('message').innerHTML = ''
    }, interval)
}

const copyLink = (link) => {
    navigator.clipboard.writeText(link)
    displayMessage('Link Copied!')
}

const removeLink = (val) => {
    let buttons = JSON.parse(localStorage.getItem('links'))
    let button = buttons.find(a => a.id === val)
    let idx = buttons.indexOf(button)
    buttons.splice(idx, 1)
    localStorage.setItem('links', JSON.stringify(buttons))
    document.getElementById('button' + val).outerHTML = ''
    document.getElementById('buttonRm' + val).outerHTML = ''
    document.getElementById('br' + val).outerHTML = ''
    displayMessage('Link Removed!')
}

const createButton = (btn, buttonContainer, index) => {
    let button = document.createElement('button');
    button.id = 'button' + btn.id
    button.className = 'linkButton'
    button.text = btn.link
    button.value = btn.id
    buttonContainer.appendChild(button);
    document.getElementById('button' + btn.id).innerHTML = btn.name

    let rm = document.createElement('button')
    rm.id = "buttonRm" + btn.id
    rm.value = btn.id
    rm.className = 'removeButton'
    //button.text = buttons[i].name
    buttonContainer.appendChild(rm);
    document.getElementById("buttonRm" + btn.id).innerHTML = 'X'

    rm.addEventListener('click', function (event) {
        var val = event.target.value
        removeLink(val)
    });

    let br = document.createElement('br')
    br.id = 'br'+btn.id
    buttonContainer.appendChild(br)

    button.addEventListener('click', function (event) {
        var link = event.target.text
        copyLink(link)
    });
}

let index = 0
/** Fetch all saved links from local storage and map over them to display them */
const createButtons = () => {
    let buttonStr = localStorage.getItem('links')
    if (buttonStr !== null) {
        let buttons = JSON.parse(buttonStr)
        let buttonContainer = document.getElementById("buttonContainer")
        index = buttons.length
        buttonContainer.innerHTML = ''
        for (let i = 0; i < buttons.length; i++){
            createButton(buttons[i], buttonContainer, index)
            index++
        }
    }
}

//Add new link to list
const addNew = () => {
    let link = document.getElementById("newLink")
    let name = document.getElementById("newLinkName")
    if (link.value.length > 100) {
        displayMessage('Maximum link length is 100 characters.', 5000)
    } else if (link.value.length > 0 && name.value.length > 0) {
        let res = { name: name.value.length > 15? name.value.slice(0,15)+'...' : name.value, link: link.value, id: index }
        let buttons = JSON.parse(localStorage.getItem('links'))
        if (buttons === null) {
            buttons = []
        }
        let indx = buttons.map(a => a.id)
        let ix = buttons.length > 0 ? Math.max(...indx) : 0
        res.id = ix + 1
        buttons.push(res)
        localStorage.setItem('links', JSON.stringify(buttons))
        createButtons()
        link.value = ''
        name.value = ''
        displayMessage('Link Created!')
    } else {
        displayMessage('You must input Name and Link first.', 5000)
    }
}

const renderForm = (open) => {
    if (!open) {
        document.getElementById('addForm').innerHTML = 'Close'
        document.getElementById('addNew').innerHTML = `<label>Name:</label>
        <input id="newLinkName"/>
        <label>Link:</label>
        <input id="newLink"/>
        <div class="centerContainer"><button class="funcButtons" id="addNewButton">Add</button></div>`

        var button = document.getElementById('addNewButton');

        // Check if the button exists before adding the event listener
        if (button) {
            button.addEventListener('click', addNew);
        }
    } else {
        document.getElementById('addForm').innerHTML = 'Add New'
        var button = document.getElementById('addNewButton');

        // Check if the button exists before adding the event listener
        if (button) {
            button.removeEventListener('click', addNew)
        }
        document.getElementById('addNew').innerHTML = ''
    }
}


let formOpen = false

document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('addForm');

    // Check if the button exists before adding the event listener
    if (button) {
        button.addEventListener('click', function () {
            // Call your function here
            renderForm(formOpen)
            formOpen = !formOpen
        });
    }
});

createButtons()