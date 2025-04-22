import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import { Contact } from '../models/contact';
import { map, merge, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentChangeAction } from "@angular/fire/compat/firestore";
import { runInInjectionContext } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsRef: AngularFirestoreCollection<Contact>;
  private environmentInjector = inject(EnvironmentInjector);

  constructor(private db: AngularFirestore) {
    this.contactsRef = this.db.collection<Contact>('contacts');
  }

  getContactsObservable(companyId: string): Observable<Contact[]> {
    console.log('companyId in the service', companyId);
    return runInInjectionContext(this.environmentInjector, () => {
    const filteredContacts = companyId != '' ?
    this.db.collection<Contact>('contacts', (ref: CollectionReference) => ref.where('companyKey', '==', companyId))
    : this.contactsRef;
    
    return filteredContacts.snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Contact>[]): Contact[] => {
          return items.map((item: DocumentChangeAction<Contact>): Contact => {
            return {
              id: item.payload.doc.id,
              name: item.payload.doc.data().name,
              phone: item.payload.doc.data().phone
            };
          });
        })
      );
    })
  }

  getcontactObservable(id: string | null): Observable<Contact | undefined> {
    // Wrap in runInInjectionContext to ensure proper injection context
    return runInInjectionContext(this.environmentInjector, () => {
      return this.db.doc<Contact>(`contacts/${id}`).valueChanges();
    });
  }

  savecontact(contact: Contact): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      return this.contactsRef.add(contact)
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

  editcontact(contact: Contact): Promise<void> {
    // Make sure contact has an ID and we're using the correct document reference
    if (!contact.id) {
      console.error('Cannot update contact without an ID');
      return Promise.reject(new Error('Cannot update contact without an ID'));
    }

    return runInInjectionContext(this.environmentInjector, () => {
      // Create a copy without the id field to avoid storing it in the document
      const { id, ...contactData } = contact;
      
      // Use the specific document reference for this contact
      return this.db.doc<Contact>(`contacts/${id}`)
        .update(contactData)
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

  deletecontact(id: string): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      // Use the specific document reference for this contact
      return this.db.doc<Contact>(`contacts/${id}`)
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



