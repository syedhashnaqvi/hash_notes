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

        this.clickable = document.querySelectorAll(".clickable")
        this.clickable.forEach(button => {
            if (button.getAttribute('listener') === true) return;
            button.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                let buttonType = e.target.dataset.button;
                switch (buttonType) {
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
        menu.children[0].innerHTML == "Add list" ? menu.children[0].innerHTML = "Text note" : menu.children[0].innerHTML = "Add list"
        menu.children[0].dataset.button == "add-list" ? menu.children[0].dataset.button = "text-note" : menu.children[0].dataset.button = "add-list"
    }

    changeColor = (color) => {
        document.querySelector("#new_note_pin").style.color=color;
    }

    addList = () => {
        document.querySelector("#note-section").innerHTML = this.notesListHtml();
        this.changeContextmenu();
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
        list.before(div.firstChild)
    }


    notesHtml = () => {
        return `
        <div class="clickable notes" data-button="notes">
            <div class="notes-sidebar" data-button="notes">
                <ul>
                    <li><a href="" class="menu-item active"><i class="fa fa-lightbulb"></i> Notes</a></li>
                    <li><a href="" class="menu-item"><i class="fa fa-bell"></i> Reminders</a></li>
                    <li><a href="" class="menu-item"><i class="fa fa-trash"></i> Trash</a></li>
                </ul>
            </div>
            <div class="notes-content-area" data-button="notes">
                <div class="take-note">
                    <div class="take-note-inner">
                        <span><i class="fa fa-arrow-left"></i> Take a note</span>
                        <span><i class="fa fa-check-square"></i> <i class="fa fa-image"></i></span>
                    </div>
                    <div id=notes_home>
                        `+
                        this.notesHome()
                        +`
                    </div>
                    `+this.newNoteHtml()+`
                </div>
                
            </div>
        </div>`;
    }

    notesTextHtml = () => {
        return `
            <textarea name="note_text" id="note_text" class="note-text" rows="1" placeholder="Take a note..." data-button="notes"></textarea>
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
                }else{
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
        let notesHtml = `
            <div>
                <h6>PINNED</h6>
                <div class="notes_home">
                `+pinnedNotesHtml+`</div>
                <h6>OTHERS</h6>
                <div class="notes_home">
                `+otherNotesHtml+`</div>
            </div>
        `
        return notesHtml
    }

    newNoteHtml = () => {
        return `
            <div class="new-note" data-button="notes">
                <div class="note-title" data-button="notes">
                    <span contenteditable="true">Title</span>
                    <span><i class="fa-solid fa-thumbtack" id="new_note_pin"></i></span>
                </div>
                <div id="note-section">
                `+this.notesTextHtml()+`
                    
                </div>
                <div class="note-foot" data-button="notes">
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