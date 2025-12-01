import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-check',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-check.component.html',
  styleUrl: './payment-check.component.css'
})
export class PaymentCheckComponent {

  constructor(private router: Router) { }

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
}
