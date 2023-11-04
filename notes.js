class HashNotes {
    constructor (baseId,data){
        this.baseId = baseId;
        this.data = data;
        this.clickable = this.clickable;
        this.init();
    }

    init = () => {
        
        let baseElem = document.getElementById(this.baseId)
        if (baseElem === null) {console.log("Error: "+this.baseId+" NOT FOUND !!!!!");return;}
        baseElem.innerHTML = this.notesHtml()
        this.addListeners();
    }

    addListeners = () => {
        this.clickable = document.querySelectorAll(".clickable")
        this.clickable.forEach(button => {
            if (button.getAttribute('listener') === true) return;
            button.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                let buttonType = e.target.dataset.button;
                switch (buttonType) {
                    case 'add-new-note':
                        this.addNewNote()
                        break;
                    case 'home-btn':
                        this.showNotesHome(e.target)
                        break;
                    case 'reminder-btn':
                        this.showReminderNotes(e.target)
                        break;
                    case 'trash-btn':
                        this.showTrashNotes(e.target)
                        break;
                    case 'overlay':
                        this.hideMenus();
                        break;
                    case 'color-pallete':
                        this.colorPallete("show")
                        break;
                    case 'context-menu':
                        this.contextMenu("show")
                        break;
                    case 'add-list':
                        this.addList();
                        break;
                    case 'text-note':
                        this.textNote();
                    case 'add-list-item':
                        this.addListItem();
                        break;
                    case 'color-pallete-btn':
                        this.changeColor(e.target.dataset.color);
                        break;
                    default:
                        break;
                }
            })
        })

        let listItems = document.querySelectorAll(".note-list li span");
        listItems.forEach(item => {
            item.addEventListener("keydown", (e) => {
                this.keyDown(e)
            })
        })
    }

    addNewNote = () => {
        document.querySelector("#notes_home").innerHTML = this.newNoteHtml();
        this.addListeners();
    }

    showNotesHome = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesHome();
        this.changeActiveMenu(elm)
        this.addListeners();
    }

    showReminderNotes = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesReminder();
        this.changeActiveMenu(elm)
        this.addListeners();
    }

    showTrashNotes = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesTrash();
        this.changeActiveMenu(elm)
        this.addListeners();
    }

    hideMenus = () => {
        document.querySelector("#notes_overlay").style.display = "none";
        this.contextMenu("hide")
        this.colorPallete("hide")
    }

    contextMenu = (action) => {
        let menu = document.querySelector(".context-menu");
        if(action == "show"){menu.style.display = "block";document.querySelector("#notes_overlay").style.display = "block";}else{menu.style.display = "none"}
    }

    colorPallete = (action) => {
        let menu = document.querySelector(".color-pallete");
        if(action == "show"){document.querySelector("#notes_overlay").style.display = "block";menu.style.display = "block"}else{menu.style.display = "none"}
    }

    changeContextmenu = () => {
        let menu = document.querySelector(".context-menu");
        if(menu === null) return;
        menu.children[0].innerHTML == "Add list" ? menu.children[0].innerHTML = "Text note" : menu.children[0].innerHTML = "Add list"
        menu.children[0].dataset.button == "add-list" ? menu.children[0].dataset.button = "text-note" : menu.children[0].dataset.button = "add-list"
    }

    changeColor = (color) => {
        document.querySelector("#new_note_pin").style.color=color;
    }

    changeActiveMenu = (elm) => {
        console.log(elm);
        document.querySelectorAll(".menu-item").forEach(button => {
            button.classList.remove("active");
        })
        elm.classList.add("active")
    }

    addList = () => {
        let noteSection = document.querySelector("#note-section")
        if(noteSection !== null) {
            noteSection.innerHTML = this.notesListHtml()
        }
        this.changeContextmenu()
        this.addListeners()
    }

    textNote = () => {
        document.querySelector("#note-section").innerHTML = this.notesTextHtml();
        this.changeContextmenu();
    }

    addListItem = () => {
        let item = `<li><input type="checkbox"/> <span contenteditable="true">List item</span></li>`;
        let list = document.querySelector("#add_item");
        let div = document.createElement('div');
        div.innerHTML = item.trim();
        if(list === null) return
        list.before(div.firstChild)
        this.addListeners()
    }

    deleteListItem = (e) => {
        if(e.target.innerHTML.length == 0){
            e.target.parentNode.remove()
        }
    }

    keyDown = (e) => {
        switch (e.key) {
            case 'Backspace':
                this.deleteListItem(e)
                break;
        
            default:
                break;
        }
    }


    notesHtml = () => {
        return `
        <div class="notes">
            <div class="notes-sidebar">
                <ul>
                    <li><span href="" class="menu-item clickable active" data-button="home-btn"><i class="fa fa-lightbulb"></i> Notes</span></li>
                    <li><span href="" class="menu-item clickable" data-button="reminder-btn"><i class="fa fa-bell"></i> Reminders</span></li>
                    <li><span href="" class="menu-item clickable" data-button="trash-btn"><i class="fa fa-trash"></i> Trash</span></li>
                </ul>
            </div>
            <div class="notes-content-area">
                <div class="take-note">
                    <div class="take-note-inner clickable" data-button="add-new-note">
                        <span data-button="add-new-note" style="cursor:pointer;"><i class="fa fa-arrow-left" data-button="home-btn"></i> Take a note</span>
                        <span data-button="add-new-note"><i class="fa fa-check-square" data-button="add-list"></i> <i class="fa fa-image" data-button="add-new-note"></i></span>
                    </div>
                    <div id=notes_home>`+this.notesHome()+`</div>
                </div>
                
            </div>
        </div>`;
    }

    notesTextHtml = () => {
        return `
            <textarea name="note_text" id="note_text" class="note-text" rows="1" placeholder="Take a note..."></textarea>
        `
    }

    notesListHtml = () => {
        return `
            <ul class="note-list" id="note_list">
                <li><input type="checkbox"/> <span contenteditable="true">List item</span></li>
                <li class="clickable add-item-btn" data-button="add-list-item" id="add_item"><i class="fa fa-plus"></i> List item</li>
            </ul>
        `
    }

    notesHome = () => {
        let pinnedNotesHtml = ``
        let otherNotesHtml = ``
        for (const property in this.data) {
            if(this.data.hasOwnProperty(property)){
                if(this.data[property].hasOwnProperty("pinned") && this.data[property].pinned === true){
                    pinnedNotesHtml+=`
                        <div class="note-item" style="background:${this.data[property].color}">
                            <h5>${this.data[property].title}</h5>
                            <div class="note-content">
                                ${this.data[property].text}
                            </div>
                        </div>
                    `
                }else if(!this.data[property].hasOwnProperty("trashed") && !this.data[property].hasOwnProperty("reminder")){
                    otherNotesHtml+=`
                        <div class="note-item" style="background:${this.data[property].color}">
                            <h5>${this.data[property].title}</h5>
                            <div class="note-content">
                                ${this.data[property].text}
                            </div>
                        </div>
                    `
                }
            }
        }
        let notesHtml = `<div>`;
        if(pinnedNotesHtml != ''){
            notesHtml+= `
            <h6>PINNED</h6>
            <div class="notes_home">
                `+pinnedNotesHtml+`
            </div>`
        }
        if(otherNotesHtml != ''){
            notesHtml+=`
            <h6>OTHERS</h6>
            <div class="notes_home">
                `+otherNotesHtml+`
            </div>`
        }
        return notesHtml+=`</div>`
    }

    notesReminder = () => {
        let notesHtml = `<div class="notes_home">`
        for (const property in this.data) {
            if(this.data.hasOwnProperty(property)){
                if(this.data[property].hasOwnProperty("reminder") && this.data[property].reminder === true){
                    notesHtml+=`
                        <div class="note-item" style="background:${this.data[property].color}">
                            <h5>${this.data[property].title}</h5>
                            <div class="note-content">
                                ${this.data[property].text}
                            </div>
                        </div>
                    `
                }
            }
        }
        return notesHtml+=`</div>`
    }

    notesTrash = () => {
        let notesHtml = `<div class="notes_home">`
        for (const property in this.data) {
            if(this.data.hasOwnProperty(property)){
                if(this.data[property].hasOwnProperty("trashed") && this.data[property].trashed === true){
                    notesHtml+=`
                        <div class="note-item" style="background:${this.data[property].color}">
                            <h5>${this.data[property].title}</h5>
                            <div class="note-content">
                                ${this.data[property].text}
                            </div>
                        </div>
                    `
                }
            }
        }
        return notesHtml+=`</div>`
    }

    newNoteHtml = () => {
        return `
            <div class="new-note">
                <div class="note-title">
                    <span contenteditable="true">Title</span>
                    <span><i class="fa-solid fa-thumbtack" id="new_note_pin"></i></span>
                </div>
                <div id="note-section">
                `+this.notesTextHtml()+`
                    
                </div>
                <div class="note-foot">
                    <span style="position:relative">
                        <i class="fa fa-bell"></i>
                        <i class="fa fa-image"></i>
                        <i class="fa fa-paint-brush clickable" data-button="color-pallete"></i>
                        <i class="fa fa-ellipsis-vertical clickable" data-button="context-menu"></i>
                        <div id="notes_overlay" class="clickable" data-button="overlay"></div>
                        <span class="context-menu">
                            <span class="clickable" data-button="add-list">Add list</span>
                            <hr style="margin:2px 0px;">
                            <span>Delete Note</span>
                        </span>
                        <span class="color-pallete">
                            <span class="clickable" data-button="color-pallete-btn" data-color="#fbeeca"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#dbfdea"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#eee"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#fedf9a"></span><br>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#a8cfff"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#ffc288"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#95e2b9"></span>
                            <span class="clickable" data-button="color-pallete-btn" data-color="#dbfdea"></span>
                        </span>
                    </span>
                    <span>
                        <i>Close</i>
                    </span>
                </div>
            </div>
        `
    }
}



// textarea = document.querySelector("#note_text");
// textarea.addEventListener('input', autoResize, false);
// function autoResize() {
//     this.style.height = 'auto';
//     this.style.height = this.scrollHeight + 'px';
// }
