import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  standalone: false
})
export class ContactListComponent implements OnInit {

  public contacts$: Observable<Contact[]> | undefined;

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.getcontacts();
  }

  getcontacts() {
    this.contacts$ = this.contactService.getcontactsObservable();
  }

}
