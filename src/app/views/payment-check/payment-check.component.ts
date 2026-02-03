import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-payment-check',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './payment-check.component.html',
  styleUrl: './payment-check.component.css'
})
export class PaymentCheckComponent {
  private dialogService = inject(DialogService);

  private router = inject(Router);
  events: any[];

  constructor() {
    this.events = [
      { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
      { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
      { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    ];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Comprobante seleccionado:', file.name);
      // Here you would upload the file to the backend
      alert(`Comprobante "${file.name}" subido exitosamente (simulado).`);
    }
  }

  cancelOrder() {
    if (confirm('¿Estás seguro de que deseas cancelar el pedido?')) {
      console.log('Pedido cancelado');
      this.router.navigate(['/']);
    }
  }

  navigateForward() {
    this.router.navigate(['/payment-check']);
  }

  navigateBack() {
    this.router.navigate(['/more-details']);
  }

  openDialog() {
    this.dialogService.open(InfoDialogComponent, {
      showHeader: false,
      modal: true,
      data: {
        type: 'payment'
      }
    });
  }
}
