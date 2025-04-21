import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import { Company } from '../models/company';
import { map, merge, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from "@angular/fire/compat/firestore";
import { runInInjectionContext } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesRef: AngularFirestoreCollection<Company>;
  private environmentInjector = inject(EnvironmentInjector);

  constructor(private db: AngularFirestore) {
    this.companiesRef = this.db.collection<Company>('companies');
  }

  getCompaniesObservable(): Observable<Company[]> {
    return this.companiesRef.snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Company>[]): Company[] => {
          return items.map((item: DocumentChangeAction<Company>): Company => {
            return {
              id: item.payload.doc.id,
              name: item.payload.doc.data().name,
              phone: item.payload.doc.data().phone
            };
          });
        })
      );
  }

  getCompanyObservable(id: string | null): Observable<Company | undefined> {
    // Wrap in runInInjectionContext to ensure proper injection context
    return runInInjectionContext(this.environmentInjector, () => {
      return this.db.doc<Company>(`companies/${id}`).valueChanges();
    });
  }

  saveCompany(company: Company): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      return this.companiesRef.add(company)
        .then(_ => {
          console.log('success on add');
          return;
        })
        .catch(error => {
          console.log('add', error);
          throw error;
        });
    });
  }

  editCompany(company: Company): Promise<void> {
    // Make sure company has an ID and we're using the correct document reference
    if (!company.id) {
      console.error('Cannot update company without an ID');
      return Promise.reject(new Error('Cannot update company without an ID'));
    }

    return runInInjectionContext(this.environmentInjector, () => {
      // Create a copy without the id field to avoid storing it in the document
      const { id, ...companyData } = company;
      
      // Use the specific document reference for this company
      return this.db.doc<Company>(`companies/${id}`)
        .update(companyData)
        .then(_ => {
          console.log('Success on update');
          return;
        })
        .catch(error => {
          console.log('update', error);
          throw error;
        });
    });
  }

  deleteCompany(id: string): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      // Use the specific document reference for this company
      return this.db.doc<Company>(`companies/${id}`)
        .delete()
        .then(_ => {
          console.log('Success on remove');
          return;
        })
        .catch(error => {
          console.log('remove', error);
          throw error;
        });
    });
  }
}



