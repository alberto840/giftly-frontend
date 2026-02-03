import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FloatLabelModule } from "primeng/floatlabel";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-more-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './more-details.component.html',
  styleUrl: './more-details.component.css'
})
export class MoreDetailsComponent {
  detailsForm: FormGroup;
  private dialogService = inject(DialogService);

  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
  ) {
    this.detailsForm = this.fb.group({
      receptor_encargado: ['', Validators.required],
      celular_1: ['', Validators.required],
      celular_2: [''],
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

  navigateForward() {
    this.router.navigate(['/payment-check']);
  }

  navigateBack() {
    this.router.navigate(['/location']);
  }

  openDialog() {
    this.dialogService.open(InfoDialogComponent, {
      showHeader: false,
      modal: true,
      data: {
        type: 'more-details'
      }
    });
  }
}
