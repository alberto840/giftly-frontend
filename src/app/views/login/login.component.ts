import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Imports
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input'; // REQUERIDO para [matInput]
import { MatButtonModule } from '@angular/material/button'; // REQUERIDO para [mat-raised-button]

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker'; // Usar ColorPickerModule (Módulo)

// Modelo (Asumo que existe)
import { LoginModel } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    // Angular Material
    MatLabel,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    // PrimeNG
    ButtonModule,
    ColorPickerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
    // Definimos el FormGroup
    loginForm!: FormGroup; // <--- Nuevo FormGroup

    // Variables
    tokendecoded: any;
    // loginUser: LoginModel; <--- Ya no es necesario

    // Inyectamos FormBuilder
    constructor(private router: Router, private fb: FormBuilder) { } // <--- FormBuilder inyectado

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    iniciarSesion(): void {    
        if (this.loginForm.invalid) {
            // Marca todos los campos como tocados para mostrar errores
            this.loginForm.markAllAsTouched(); 
            this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
            return;
        }

        // Aquí puedes acceder a los datos:
        const { email, password } = this.loginForm.value;
        console.log('Datos del formulario reactivo:', email, password);
        
        // ... Lógica de inicio de sesión ...

        // this.loginForm.reset(); // Opcional: limpiar el formulario después del envío
    }

    openSnackBar(message: string, action: string) {
        // Implementación de Snackbar
    }
}