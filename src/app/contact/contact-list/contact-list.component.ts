import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { Company } from '../../models/company';
import { CompanyService } from '../../company/company.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  standalone: false
})
export class ContactListComponent implements OnInit {

  public contacts$: Observable<Contact[]> | undefined;
  public companies$: Observable<Company[]> | undefined;

  constructor(
    private contactService: ContactService,
    private companyService: CompanyService
  ) {

  }

  ngOnInit() {
    this.getCompanies();
    this.getContacts('');
  }

  getCompanies() {
    this.companies$ = this.companyService.getCompaniesObservable();
  }

  getContacts(companyId: string = '') {
    console.log('companyId', companyId);
    this.contacts$ = this.contactService.getContactsObservable(companyId);
    
  }

}
