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
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import {AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR} from "@angular/fire/compat/auth";
import { LoginComponent } from './login/login.component';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  //tosUrl: '<your-tos-link>',
  //privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
  declarations: [
    AppComponent,
    CompanyEditComponent,
    CompanyListComponent,
    ContactEditComponent,
    ContactListComponent,
    LoginComponent
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
    AngularFireModule.initializeApp(environment.firebase),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)

  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: CompanyService,
      useFactory: (afs: AngularFirestore) => new CompanyService(afs),
      deps: [AngularFirestore],
    },
    //{provide: USE_AUTH_EMULATOR, useValue: !environment.production ? ['http://localhost', 9099] : undefined},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
