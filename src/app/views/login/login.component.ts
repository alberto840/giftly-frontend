import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    console.log('Login response', response);
                    // Assuming response contains token or user info
                    if (response.data.token) {
                        console.log('Token', response.data.token);
                        localStorage.setItem('token', response.data.token);
                        console.log('User', response.data.usuario);
                        localStorage.setItem('user', JSON.stringify(response.data.usuario));
                    }
                    // Redirect to home or dashboard
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Login error', err);
                    this.errorMessage = 'Invalid email or password';
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    navigateToMessage() {
        this.router.navigate(['/register']);
    }

    navigateBack() {
        this.router.navigate(['/']);
    }
}