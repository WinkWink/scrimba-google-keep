class App {
    constructor(){
        // data starts as an empty array of notes 
        this.notes = [];
        this.title = '';
        this.text = '';
        this.id = '';
        // call when app starts up
        // it is best practice to use the $ to show we are working with an html element rather than data 
        this.$form = document.querySelector('#form');
        this.$notes = document.querySelector('#notes');
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text');
        this.$formButtons = document.querySelector('#form-buttons');
        this.$placeholder = document.querySelector('#placeholder');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$modal = document.querySelector('.modal');
        this.$modalTitle = document.querySelector('.modal-title');
        this.$modalText = document.querySelector('.modal-text');
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$


        this.addEventListeners();
    }
    // add event listeners method on app class 
    // general place where we add event listeners to each of our elements so that we can register different events 
    addEventListeners(){
        // listen to click event, when this happens we get the click event data 
       document.body.addEventListener('click', event => {
        this.handleFormClick(event);
        this.selectNote(event);
        this.openModal(event);
       }); 

       document.body.addEventListener('mouseover', event => {
            this.openToolTip(event);
       });

        // listen for when the form is submitted 
        this.$form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text; 
            
            if(hasNote){
                // add note
                // passing in both title and text as an object 
                // this is called object shorthand  
                this.addNote({title, text});
            }
        });   

        this.$formCloseButton.addEventListener('click', event =>{
            event.stopPropagation();
            this.closeForm(); 
        });

        this.$modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);
        })
    }

    handleFormClick(event){
        // the contains method lets us know if it contains this element
        const isFormClicked = this.$form.contains(event.target);
        
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;

        if (isFormClicked) {
            // open form
            this.openForm();
        }else if(hasNote){
            this.addNote({title,text});
        }else{
            // close form 
            this.closeForm();
        }
    }

    openForm () {
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm(){
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    openModal(event){
        if(event.target.closest('.note')){
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event){
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openToolTip(event){
        if(event.target.matches('.toolbar-color')) return;
        this.id = event.target.nextElementSibling.dataset.id;
        const noteCoords = event.target.getBoudingClientRect();
    }

    addNote({ title , text }){
        const newNote = {
            title: title,
            text: text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        };
        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
    }

    editNote(){
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, title, text} : note
        );
        this.displayNotes();
    }

    selectNote(event){
        const $selectedNote = event.target.closest('.note');
        if(!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id;

    }

    displayNotes(){
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? "none" : 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://img.icons8.com/material-outlined/24/000000/color-dropper.png">
              <img class="toolbar-delete" src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png">
            </div>
          </div>
        </div>
     `).join("");
    //  the join adds each templated string into one string so it no longer has a , in the DOM 
    }
}

// instantiate app class 
new App()