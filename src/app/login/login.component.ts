import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription | undefined;
  
  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) {}
    
  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.auth.authState.subscribe(user => {
      if (user) {
        console.log('User logged in successfully:', user);
        // You can access specific properties like:
        console.log('User ID:', user.uid);
        console.log('Display name:', user.displayName);
        console.log('Email:', user.email);

        // Navigate to company list after successful login
        this.router.navigate(['/company/all']);
      }
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
