import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { PedidoRegistroRequest } from '../../models/pedido.model';

@Component({
  selector: 'app-payment-check',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './payment-check.component.html',
  styleUrl: './payment-check.component.css'
})
export class PaymentCheckComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  public pedidoForm = this.fb.group({
    pedido: this.fb.group({
      fechaCreacion: [new Date().toISOString().split('T')[0], Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      usuarioId: [null, Validators.required],
      qrId: [null],
      tiendaPremioId: [null],
      status: ['PENDIENTE']
    }),
    detallePedido: this.fb.group({
      mensaje: [''],
      instrucciones: [''],
      receptorEncarga: ['', Validators.required],
      celular1: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      celular2: [''],
      nombreObjetivo: [''],
      nombre_emisor: [''],
      ubicacionId: [null, Validators.required]
    }),
    productos: this.fb.array([])
  });

  events: any[];

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const data = window.history.state['pedido'] as PedidoRegistroRequest;

    if (data) {
      this.cargarDatosEnFormulario(data);
    }
  }

  cargarDatosEnFormulario(data: PedidoRegistroRequest) {
    if (data.pedido) {
      this.pedidoForm.controls.pedido.patchValue(data.pedido as any);
    }
    if (data.detallePedido) {
      this.pedidoForm.controls.detallePedido.patchValue(data.detallePedido as any);
    }

    if (data.productos && data.productos.length > 0) {
      data.productos.forEach(prod => {
        const prodGroup = this.fb.group({
          productoId: [prod.productoId],
          cantidad: [prod.cantidad]
        });
        (this.pedidoForm.controls.productos as any).push(prodGroup);
      });
    }
  }

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

  onSubmit() {
    if (this.pedidoForm.valid) {
      const data = this.pedidoForm.value;
      console.log(data);
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
