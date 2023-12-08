class HashNotes {
    constructor (baseId,data){
        this.baseId = baseId
        this.data = data
        this.clickable = this.clickable
        this.changeable = this.changeable
        this.newNoteData = {
            title:"Title",
            type:'text',
            text:'',
            color:'#95e2b9',
            pinned: false,
            reminder: true,
            trashed: false
        }
        this.selectedNoteID = this.selectedNoteID
        this.init();
    }

    init = () => {
        let baseElem = document.getElementById(this.baseId)
        if (baseElem === null) {console.log("Error: "+this.baseId+" NOT FOUND !!!!!");return;}
        baseElem.innerHTML = this.notesHtml()
        this.addListeners()
        this.existingNoteClicked()
    }

    addChangeAbleListerners = () => {
        this.changeable = document.querySelectorAll(".changeable")
        this.changeable.forEach(input => {
            if(input.getAttribute('listener')===true) return
            input.addEventListener("keyup", (e) => {
                e.stopImmediatePropagation();
                switch(e.currentTarget.dataset.property){
                    case 'title':
                        this.newNoteData.title = e.currentTarget.innerHTML;
                        break;
                    case 'text':
                        this.newNoteData.text = e.currentTarget.innerHTML;
                        break;
                    case 'list-item':
                        this.listItemChanged();
                        break;
                    default:
                        break;
                }
                
                this.noteChange(this.newNoteData);
            })
        })
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
                    case 'reminder-note':
                        this.reminderNote(e.target);
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
                        this.contextMenu("show",e)
                        break;
                    case 'add-list':
                        this.addList();
                        break;
                    case 'text-note':
                        this.textNote();
                    case 'add-list-item':
                        this.addListItem();
                        break;
                    case 'image-note':
                        this.insertImage()
                        break;
                    case 'color-pallete-btn':
                        this.changeColor(e.target.dataset.color);
                        break;
                    case 'pin-note':
                        this.pinNote(e.target);
                        break;
                    case 'close-note-btn':
                        this.noteClose();
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

        let baseElem = document.getElementById(this.baseId)
        baseElem.addEventListener("keydown", (e) => {
            e.stopImmediatePropagation()
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                if(typeof onNoteSave == "function"){
                    onNoteSave(this.newNoteData);
                }
            }
        })

        let noteTextarea = document.querySelector("#note_text");
        if(noteTextarea != null){
            noteTextarea.addEventListener("keydown", (e) => {
                e.stopImmediatePropagation();
                if(e.key == "Enter"){
                    e.preventDefault();
                    e.preventDefault();
                    document.execCommand("insertLineBreak"); //Insert a new line
                }
            })
        }

    }

    noteCheckChange = () => {
        let checkboxes = document.querySelectorAll(".note_checkbox")
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", (e) => {
                e.stopImmediatePropagation();
                this.listItemChanged();
                this.noteChange(this.newNoteData);
            })
        })
    }

    addNewNote = () => {
        document.querySelector("#notes_home").innerHTML = this.newNoteHtml();
        this.addListeners();
        this.addChangeAbleListerners();
    }

    pinNote = (elm) => {
        this.newNoteData.pinned = !this.newNoteData.pinned;
        elm.style.transform = this.newNoteData.pinned==true ? "rotate(0deg)" : "rotate(45deg)";
        this.noteChange(this.newNoteData);
    }

    reminderNote = (elm) => {
        this.newNoteData.reminder = !this.newNoteData.reminder;
        this.newNoteData.reminder == true ? elm.classList.add("selectedBtn") : elm.classList.remove('selectedBtn')
        this.noteChange(this.newNoteData)
    }

    showNotesHome = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesHome();
        this.changeActiveMenu(elm)
        this.addListeners();
        this.existingNoteClicked()
    }

    showReminderNotes = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesReminder();
        this.changeActiveMenu(elm)
        this.addListeners();
        this.existingNoteClicked()
    }

    showTrashNotes = (elm) => {
        document.querySelector("#notes_home").innerHTML = this.notesTrash();
        this.changeActiveMenu(elm)
        this.addListeners();
        this.existingNoteClicked()
    }

    hideMenus = () => {
        document.querySelector("#notes_overlay").style.display = "none";
        this.contextMenu("hide")
        this.colorPallete("hide")
    }

    contextMenu = (action,evt = null) => {
        let menu = evt?evt.currentTarget.nextElementSibling.nextElementSibling:document.querySelector(".context-menu");
        if(action == "show"){
            menu.style.display = "block";document.querySelector("#notes_overlay").style.display = "block";
        }else{
            menu = document.querySelectorAll(".context-menu");
            menu.forEach(item => {
                item.style.display = "none"
            })
        }
    }

    colorPallete = (action) => {
        let menu = document.querySelector(".color-pallete");
        if(action == "show"){document.querySelector("#notes_overlay").style.display = "block";menu.style.display = "block"}else{menu.style.display = "none"}
    }

    changeColor = (color) => {
        document.querySelector("#new_note_pin").style.color=color;
        this.newNoteData.color = color;
        this.noteChange(this.newNoteData)
    }

    changeActiveMenu = (elm) => {
        document.querySelectorAll(".menu-item").forEach(button => {
            button.classList.remove("active");
        })
        elm.classList.add("active")
    }

    addList = () => {
        let noteSection = document.querySelector("#note_text")
        if(noteSection !== null) {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.notesListHtml()
            noteSection.appendChild(htmlObject)
        }
        this.newNoteData.type = "html"
        this.addListeners()
        this.noteChange(this.newNoteData)
        this.addChangeAbleListerners()
        this.noteCheckChange()
    }

    textNote = () => {
        document.querySelector("#note-section").innerHTML = this.notesTextHtml();
        this.newNoteData.type = "text"
        this.noteChange(this.newNoteData)
    }

    insertImage = () => {
        let fileBrowser = document.querySelector("#note_img_upload");
        fileBrowser.click();
        fileBrowser.addEventListener("change", (e) => {
            e.stopImmediatePropagation()
            const [file] = fileBrowser.files
            if(file){
                let scalableDiv = document.createElement('div')
                let img = document.createElement('img');
                img.classList.add("scaleable-image")
                img.src = URL.createObjectURL(file);
                scalableDiv.appendChild(img)
                document.querySelector("#note_text").appendChild(scalableDiv)
       
                let noteImages = document.querySelectorAll(".scaleable-image");
                noteImages.forEach(noteImage => {
                    noteImage.addEventListener("click", (e) => {
                        e.stopImmediatePropagation();
                        e.currentTarget.parentNode.classList.add("scalable-container")
                        
                        let scaleableContainers = document.querySelectorAll(".scalable-container");
                        scaleableContainers.forEach(scaleableContainer => {
                            scaleableContainer.addEventListener("mouseup", (e) => {
                                e.currentTarget.classList.remove('scalable-container')
                            })
                        })
                    })
                })

            }
        })

    }

    addListItem = () => {
        let item = `<li><span contenteditable="false"><input type="checkbox" class="note_checkbox"/></span><span class="changeable" contenteditable="true" data-property="list-item">List item</span></li>`;
        let list = document.querySelector("#add_item");
        let div = document.createElement('div');
        div.innerHTML = item.trim();
        if(list === null) return
        list.before(div.firstChild)
        this.addListeners()
        this.addChangeAbleListerners()
        this.noteCheckChange()
    }

    listItemChanged = () => {
        let noteList = document.querySelector("#note_list").innerHTML;
        let extraHtml = `<li class="clickable add-item-btn" data-button="add-list-item" id="add_item"><i class="fa fa-plus"></i> List item</li>`;
        noteList = `<ul class="note-list">`+noteList.replace(extraHtml,'')+`</ul>`;
        this.newNoteData.text = noteList;
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

    noteChange = (data) => {
        if(typeof onNoteChange == "function"){
            onNoteChange(data);
        }
    }

    noteSave = () => {
        if(typeof onNoteSave == "function"){
            onNoteSave(this.newNoteData);
        }
    }

    noteClose = () => {
        if(typeof onNoteClose == "function"){
            onNoteClose(this.newNoteData);
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
                        <span data-button="add-new-note"><i class="fa fa-check-square" data-button="add-list"></i> <i class="fa fa-image clickable" data-button="image-note"></i></span>
                    </div>
                    <div id=notes_home>`+this.notesHome()+`</div>
                </div>
                
            </div>
        </div>`;
    }

    notesTextHtml = () => {
        return `
            <div contenteditable="true" id="note_text" class="note-text changeable" rows="1" placeholder="Take a note..." data-property="text">
            </div>
        `
    }

    notesListHtml = () => {
        return `
            <ul class="note-list" id="note_list">
                <li><span contenteditable="false"><input type="checkbox" class="note_checkbox"/></span><span contenteditable="true" class="changeable" data-property="list-item">List item</span></li>
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
                            ${this.noteFooterToolsHtml(false,true,false,false)}
                        </div>
                    `
                }else if(!this.data[property].hasOwnProperty("trashed") && !this.data[property].hasOwnProperty("reminder")){
                    otherNotesHtml+=`
                        <div class="note-item" style="background:${this.data[property].color}">
                            <h5>${this.data[property].title}</h5>
                            <div class="note-content">
                                ${this.data[property].text}
                            </div>
                            ${this.noteFooterToolsHtml(false,true,false,false)}
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
                            ${this.noteFooterToolsHtml(false,true,false,true)}
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
                            ${this.noteFooterToolsHtml(false,true,false,false)}
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
                    <span contenteditable="true" class="changeable" data-property="title">${this.newNoteData.title}</span>
                    <span><i class="fa-solid fa-thumbtack clickable" data-button="pin-note" id="new_note_pin" style="transform:${this.newNoteData.pinned==true ? "rotate(0deg)" : "rotate(45deg)"}"></i></span>
                </div>
                <div id="note-section">
                `+this.notesTextHtml()+`
                    
                </div>
                `+this.noteFooterToolsHtml(true,false,true,false)+`
            </div>
        `
    }

    noteFooterToolsHtml = (close=true,bottom=true,listOption=false,reminder) => {
        return `
        <div class="note-foot ${bottom ? 'note-foot-bottom':''}">
            <input type="file" id="note_img_upload" style="display:none"/> 
            <span style="position:relative">
                <i class="fa fa-bell ${reminder==true ? 'selectedBtn':''} clickable" data-button="reminder-note"></i>
                <i class="fa fa-image clickable" data-button="image-note"></i>
                <i class="fa fa-paint-brush clickable" data-button="color-pallete"></i>
                <i class="fa fa-ellipsis-vertical clickable" data-button="context-menu"></i>
                <div id="notes_overlay" class="clickable" data-button="overlay"></div>
                <span class="context-menu">
                    ${listOption?`<span class="clickable" data-button="add-list">Add list</span><hr style="margin:2px 0px;">`:``}
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
            ${close ? `
                <span>
                    <i class="clickable" data-button="close-note-btn">Close</i>
                </span>
            `:''}
            
        </div>
        `
    }


    // NOTES HOME
    existingNoteClicked = () => {
        let notes = document.querySelectorAll(".note-item")
        notes.forEach(note =>{
            note.addEventListener("click", (e) => {
                let selected = document.querySelector(".note-item.selected")
                if(selected != null){
                    selected.classList.remove('selected')
                }
                e.currentTarget.classList.add('selected')
            })
        })
    }
}