import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-more-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './more-details.component.html',
  styleUrl: './more-details.component.css'
})
export class MoreDetailsComponent {
  detailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.detailsForm = this.fb.group({
      detalle: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.detailsForm.valid) {
      console.log('Detalle de entrega:', this.detailsForm.value.detalle);
      // Navigate to payment or next step
      // this.router.navigate(['/payment']);
      alert('Detalle guardado. Ir a pago (simulado).');
    } else {
      this.detailsForm.markAllAsTouched();
    }
  }
}
