import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { Observable, of } from 'rxjs';
import { Contact } from '../../models/contact';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../models/company';
import { CompanyService } from '../../company/company.service';


@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
  standalone: false
})
export class ContactEditComponent implements OnInit {

  contact$: Observable<Contact | undefined>;
  companies$: Observable<Company[]>; 

  contact: Contact | undefined;

  constructor(
    private contactService: ContactService,
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private router: Router) 
    {
      this.contact$ = this.contactService.getcontactObservable(this.id);
      this.companies$ = companyService.getCompaniesObservable();
      if (!this.isNew) {
        this.contact$ = contactService.getcontactObservable(this.id);
      } else {
        this.contact$ = of({} as Contact);
      }
  }

  ngOnInit() {
    this.contact$.subscribe((contact: Contact | undefined) => {
      this.contact = contact;
      // Ensure the contact has an ID if we're editing an existing one
      if (!this.isNew && contact && !contact.id) {
        this.contact = { ...contact, id: this.id || '' };
      }
    });
  }

  savecontact(contact : Contact) {
    this.contactService.savecontact(contact)
      .then(_ => this.router.navigate(['/contact/all']));
  }

  editcontact(contact : Contact) {
    // Make sure the contact object has the ID
    if (this.id && contact) {
      const contactWithId = { ...contact, id: this.id };
      this.contactService.editcontact(contactWithId)
        .then(_ => this.router.navigate(['/contact/all']));
    }
  }
  
  deletecontact() {
    if (this.id) {
      this.contactService.deletecontact(this.id)
        .then(_ => this.router.navigate(['/contact/all']));
    }
  }

  get id(): string | null {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  get isNew(): boolean {
    return this.id === 'new';
  }

}