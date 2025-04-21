import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { Observable } from 'rxjs';
import { Company } from '../../models/company';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  standalone: false
})
export class CompanyListComponent implements OnInit {

  public companies$: Observable<Company[]> | undefined;

  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.companies$ = this.companyService.getCompaniesObservable();
  }

}
