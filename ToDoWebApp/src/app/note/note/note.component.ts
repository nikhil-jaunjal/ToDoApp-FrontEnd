import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  noteList = [];
  showPopup: boolean = false;
  noteForm: FormGroup;
  invalidForm: boolean = false;
  apiError: boolean = false;
  editMode: boolean = false;
  selectedNote: any;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private fb: FormBuilder,
    private noteService: NoteService) { }

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.getNotes();
  }

  getNotes() {
    this.noteService.getAllNotesByUserId().subscribe(
      (data: any) => {
        this.noteList = data.noteList;
      }, (err: any) => {
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      });
  }

  showNotePopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.noteForm.reset();
    this.getNotes();
    this.showPopup = false;
    this.apiError = false;
    this.invalidForm = false;
    this.selectedNote = null;
    this.editMode = false;
  }

  editNote(note) {
    this.editMode = true;
    this.selectedNote = note;
    this.noteForm = this.fb.group({
      title: [note.title, [Validators.required]],
      description: [note.description, [Validators.required]]
    });
    this.showNotePopup();
  }

  onSubmit() {
    this.invalidForm = false;
    if (this.noteForm.invalid) {
      this.invalidForm = true;
      return;
    }
    let newNote = this.noteForm.value;
    newNote['userId'] = localStorage.getItem("userId");
    if (this.editMode == false) {
      this.noteService.saveNote(newNote).subscribe(
        (data: any) => {
          this.closePopup();
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        }, (err: any) => {
          this.apiError = true;
          setTimeout(() => {
            this.apiError = false;
          }, 3000);
        });
    } else {
      newNote["noteId"] = this.selectedNote.noteId;
      this.noteService.updateNote(newNote).subscribe(
        (data: any) => {
          this.closePopup();
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        }, (err: any) => {
          this.apiError = true;
          setTimeout(() => {
            this.apiError = false;
          }, 3000);
        });
    }
  }

  deleteNote(noteId) {
    this.noteService.deleteNote(noteId).subscribe(
      (data: any) => {
        this.getNotes();
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      }, (err: any) => {
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      });
  }

}
