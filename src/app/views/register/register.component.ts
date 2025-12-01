import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombreCompl: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimien: ['', Validators.required],
      // rolId will be handled in backend or default to user role
      rolId: [1] // Assuming 1 is default user role
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onSubmit() {
    if (this.registerForm.valid && this.selectedFile) {
      const usuario: UsuarioModel = {
        ...this.registerForm.value,
        id: 0, // Backend handles ID
        puntos: 0 // Default points
      };

      this.authService.addUsuario(usuario, this.selectedFile).subscribe({
        next: (response) => {
          console.log('User registered', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error', err);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      if (!this.selectedFile) {
        this.errorMessage = 'Profile picture is required.';
      }
    }
  }
}
