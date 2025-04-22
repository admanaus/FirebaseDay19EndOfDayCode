import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardActions, MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { environment } from '../environment';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore, AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { FormsModule } from '@angular/forms';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyService } from './company/company.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ContactEditComponent } from './contact/contact-edit/contact-edit.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CompanyEditComponent,
    CompanyListComponent,
    ContactEditComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatCardActions,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase), // <-- add this
    AngularFirestoreModule

  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: CompanyService,
      useFactory: (afs: AngularFirestore) => new CompanyService(afs),
      deps: [AngularFirestore],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
