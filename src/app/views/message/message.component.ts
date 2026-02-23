import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PedidoRegistroRequest } from '../../models/pedido.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  value!: string;

  private router = inject(Router);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  public pedidoForm = this.fb.group({
    pedido: this.fb.group({
      fechaCreacion: [new Date().toISOString().split('T')[0]],
      total: [0],
      usuarioId: [null],
      qrId: [null],
      tiendaPremioId: [null],
      status: ['PENDIENTE']
    }),
    detallePedido: this.fb.group({
      mensaje: [''],
      instrucciones: [''],
      receptorEncarga: [''],
      celular1: [''],
      celular2: [''],
      nombreObjetivo: [''],
      nombre_emisor: [''],
      ubicacionId: [null]
    }),
    productos: this.fb.array([])
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const data = window.history.state['pedido'] as PedidoRegistroRequest;

    if (data) {
      this.cargarDatosEnFormulario(data);
    }
  }

  cargarDatosEnFormulario(data: PedidoRegistroRequest) {
    if (data.pedido) {
      this.pedidoForm.get('pedido')?.patchValue(data.pedido as any);
    }
    if (data.detallePedido) {
      this.pedidoForm.get('detallePedido')?.patchValue(data.detallePedido as any);
    }

    // Limpiamos el array antes de cargar para evitar duplicados si el usuario va y viene
    const productosArray = this.pedidoForm.get('productos') as FormArray;
    while (productosArray.length !== 0) {
      productosArray.removeAt(0);
    }

    if (data.productos && data.productos.length > 0) {
      data.productos.forEach(prod => {
        productosArray.push(this.fb.group({
          productoId: [prod.productoId],
          cantidad: [prod.cantidad]
        }));
      });
    }
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      const data = this.pedidoForm.value;
      console.log(data);
      this.router.navigate(['/location'], { state: { pedido: data } });
    } else {
      this.pedidoForm.markAllAsTouched();
    }
  }

  navigateForward() {
    this.router.navigate(['/location']);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  openDialog() {
    this.dialogService.open(InfoDialogComponent, {
      showHeader: false,
      modal: true,
      data: {
        type: 'message'
      }
    });
  }
}
