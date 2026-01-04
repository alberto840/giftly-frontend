import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UbicacionService } from '../../services/ubicacion/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  locationForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      direccion: ['', Validators.required],
      referencia: ['', Validators.required], // Using second location field as reference or similar
      notas: [''],
      guardar: [false]
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      const ubicacion: Ubicacion = {
        id: 0, // Backend handles ID
        direccion: this.locationForm.value.direccion,
        latitud: '0', // Placeholder
        longitud: '0', // Placeholder
        referencia: this.locationForm.value.referencia
      };

      this.ubicacionService.crear(ubicacion).subscribe({
        next: (response) => {
          console.log('Location created', response);
          // Navigate or show success
          alert('Ubicación guardada exitosamente');
        },
        error: (err) => {
          console.error('Location creation error', err);
          this.errorMessage = 'Error al guardar la ubicación.';
        }
      });
    } else {
      this.locationForm.markAllAsTouched();
    }
  }

  navigateForward() {
    this.router.navigate(['/more-details']);
  }

  navigateBack() {
    this.router.navigate(['/message']);
  }
}
