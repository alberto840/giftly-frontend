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
import { PedidoRegistroRequest } from '../../models/pedido.model';

@Component({
  selector: 'app-more-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './more-details.component.html',
  styleUrl: './more-details.component.css'
})
export class MoreDetailsComponent {

  private router = inject(Router);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  public nuevaUbicacionCargada: any = null;

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
      receptorEncarga: ['', Validators.required],
      celular1: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      celular2: [''],
      nombreObjetivo: [''],
      nombre_emisor: [''],
      ubicacionId: [null]
    }),
    productos: this.fb.array([])
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = window.history.state['data'];

    if (state) {
      // 1. Cargamos el formulario principal (Pedido)
      if (state.pedido) {
        this.cargarDatosEnFormulario(state.pedido);
      }

      // 2. Guardamos la nueva ubicación en nuestra variable local
      if (state.nuevaUbicacion) {
        this.nuevaUbicacionCargada = state.nuevaUbicacion;
        console.log('Nueva ubicación recibida:', this.nuevaUbicacionCargada);
      }
    }
  }

  cargarDatosEnFormulario(data: any) {
    // Limpiamos el FormArray antes de insertar para evitar duplicados
    const productosArray = this.pedidoForm.get('productos') as any;
    while (productosArray.length !== 0) {
      productosArray.removeAt(0);
    }

    // Seteamos los valores de los grupos
    if (data.pedido) {
      this.pedidoForm.get('pedido')?.patchValue(data.pedido);
    }
    if (data.detallePedido) {
      this.pedidoForm.get('detallePedido')?.patchValue(data.detallePedido);
    }

    // Cargamos los productos al array dinámico
    if (data.productos && data.productos.length > 0) {
      data.productos.forEach((prod: any) => {
        productosArray.push(this.fb.group({
          productoId: [prod.productoId],
          cantidad: [prod.cantidad]
        }));
      });
    }
  }

  constructor() {
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      const dataFinal = {
        pedido: this.pedidoForm.value,
        nuevaUbicacion: this.nuevaUbicacionCargada
      };

      console.log('Datos finales listos para pago:', dataFinal);
      this.router.navigate(['/payment-check'], { state: { data: dataFinal } });
    } else {
      console.log(this.pedidoForm.value);
      this.pedidoForm.markAllAsTouched();
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
