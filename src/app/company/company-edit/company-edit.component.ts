import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { Observable, of } from 'rxjs';
import { Company } from '../../models/company';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css'],
  standalone: false
})
export class CompanyEditComponent implements OnInit {

  company$: Observable<Company | undefined>;
  company: Company | undefined;

  constructor(
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.company$ = this.companyService.getCompanyObservable(this.id);

    if (!this.isNew) {
      this.company$ = companyService.getCompanyObservable(this.id);
    } else {
      this.company$ = of({} as Company);
    }
  }

  ngOnInit() {
    this.company$.subscribe((company: Company | undefined) => {
      this.company = company;
      // Ensure the company has an ID if we're editing an existing one
      if (!this.isNew && company && !company.id) {
        this.company = { ...company, id: this.id || '' };
      }
    });
  }

  saveCompany(company : Company) {
    this.companyService.saveCompany(company)
      .then(_ => this.router.navigate(['/company/all']));
  }

  editCompany(company : Company) {
    // Make sure the company object has the ID
    if (this.id && company) {
      const companyWithId = { ...company, id: this.id };
      this.companyService.editCompany(companyWithId)
        .then(_ => this.router.navigate(['/company/all']));
    }
  }
  
  deleteCompany() {
    if (this.id) {
      this.companyService.deleteCompany(this.id)
        .then(_ => this.router.navigate(['/company/all']));
    }
  }

  get id(): string | null {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  get isNew(): boolean {
    return this.id === 'new';
  }

}