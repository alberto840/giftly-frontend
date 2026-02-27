import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ProductosDialogComponent } from '../productos-dialog/productos-dialog.component';
import { PedidoRegistroRequest } from '../../models/pedido.model';
import { ImageModule } from 'primeng/image';
import { QrService } from '../../services/qr/qr.service';
import { Qr } from '../../models/qr_model';
import { UbicacionService } from '../../services/ubicacion/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { PedidoService } from '../../services/pedido/pedido.service';
import { FileUploadModule } from 'primeng/fileupload';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-payment-check',
  standalone: true,
  imports: [FileUploadModule, ImageModule, CommonModule, ReactiveFormsModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './payment-check.component.html',
  styleUrl: './payment-check.component.css'
})
export class PaymentCheckComponent {
  uploadedFile: any;
  public usuarioId: number = JSON.parse(localStorage.getItem('user') || '{}').id;
  public nuevaUbicacionRecibida!: Ubicacion;

  private router = inject(Router);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);
  private qrService = inject(QrService);
  private ubicacionService = inject(UbicacionService);
  private pedidoService = inject(PedidoService);
  private notificacionService = inject(NotificationService);

  public qr: Qr | null = null;

  public pedidoForm = this.fb.group({
    pedido: this.fb.group({
      fechaCreacion: [new Date().toISOString().split('T')[0], Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      usuarioId: [this.usuarioId || 1],
      qrId: [0],
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
      ubicacionId: [null as number | null, Validators.required]
    }),
    productos: this.fb.array([])
  });

  events: any[];

  get productosArray(): FormArray {
    return this.pedidoForm.get('productos') as FormArray;
  }

  ngOnInit() {
    // Accedemos al estado que pasaste en el navigate: { data: dataFinal }
    const state = window.history.state as { data: any };

    if (state && state.data) {
      const dataRecibida = state.data;
      if (dataRecibida.pedido) {
        this.cargarDatosEnFormulario(dataRecibida.pedido);
        console.log('Pedido recibido:', dataRecibida.pedido);
      }
      if (dataRecibida.nuevaUbicacion) {
        this.nuevaUbicacionRecibida = dataRecibida.nuevaUbicacion;
        console.log('Nueva ubicación recibida:', dataRecibida.nuevaUbicacion);
      }
    }
    this.obtenerQr();

    //setear usuarioId
    this.pedidoForm.controls.pedido.patchValue({ usuarioId: this.usuarioId });
    //setear qrId
    this.pedidoForm.controls.pedido.patchValue({ qrId: this.qr?.id });
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

  guardarUbicacion() {
    return this.ubicacionService.crear(this.nuevaUbicacionRecibida);
  }

  enviarPedidoFinal() {
    if (this.pedidoForm.valid) {
      const dataFinal = this.pedidoForm.value;
      console.log('Datos finales listos para el backend:', dataFinal);
      this.pedidoService.registrarPedidoCompleto(dataFinal as any).subscribe({
        next: (res: any) => {
          console.log('Pedido creado exitosamente:', res);
          this.notificarTelegram(res.data.pedido.id);
        },
        error: (err) => {
          console.error('Error al crear el pedido:', err);
        }
      });
    } else {
      this.pedidoForm.markAllAsTouched();
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
  // Para el input HTML estándar (el del label morado)
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      console.log('Archivo cargado desde input:', this.uploadedFile);
    }
  }

  obtenerQr() {
    this.qrService.getLastQr().subscribe({
      next: (qr) => {
        this.qr = qr;
      },
      error: (err) => {
        console.error('Error al obtener el QR', err);
      }
    });
  }

  cancelOrder() {
    if (confirm('¿Estás seguro de que deseas cancelar el pedido?')) {
      console.log('Pedido cancelado');
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    const detalleGroup = this.pedidoForm.get('detallePedido');
    const ubicacionId = detalleGroup?.get('ubicacionId')?.value;
    console.log('Ubicación ID:', ubicacionId);
    console.log('detalle:', detalleGroup?.value);
    if (!ubicacionId || ubicacionId === 0) {
      if (this.nuevaUbicacionRecibida) {
        console.log('Guardando nueva ubicación');
        this.ubicacionService.crear(this.nuevaUbicacionRecibida).subscribe({
          next: (res: any) => { // Usamos any para evitar el error de tipado con 'data'
            console.log('Ubicación guardada exitosamente1', res);
            if (res) {
              console.log('Ubicación guardada exitosamente2', res);
              const nuevoId = res.id;
              // Usamos patchValue para actualizar solo el ID
              this.pedidoForm.get('detallePedido')?.patchValue({ ubicacionId: nuevoId } as any);
              console.log('Ubicación guardada exitosamente3', this.pedidoForm.value);
              this.enviarPedidoFinal();
            }
          },
          error: (err) => console.error('Error al guardar ubicación', err)
        });
      } else {
        alert('No hay una ubicación seleccionada');
      }
    } else {
      console.log('Enviando pedido');
      // Si ya tenía un ID (ubicación guardada), enviamos directamente
      this.enviarPedidoFinal();
    }
  }

  onUpload(event: any) {
    // Para el componente p-fileUpload de PrimeNG
    if (event.files && event.files.length > 0) {
      this.uploadedFile = event.files[0];
      console.log('Archivo cargado desde PrimeNG:', this.uploadedFile);
    } else if (event.target && event.target.files) {
      // Por si acaso llamaste a onUpload desde el input estándar
      this.onFileSelected(event);
    }
  }

  notificarTelegram(pedidoId: number) {
    this.notificacionService.enviarNotificacionTelegram(pedidoId, this.uploadedFile).subscribe({
      next: (res: any) => {
        console.log('Notificación enviada exitosamente:', res);
      },
      error: (err) => {
        console.error('Error al enviar la notificación:', err);
      }
    });
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

  openProductosDialog() {
    // Build the plain list from the FormArray
    const productosData = this.productosArray.controls.map(ctrl => ({
      productoId: ctrl.get('productoId')?.value,
      cantidad: ctrl.get('cantidad')?.value
    }));

    const ref = this.dialogService.open(ProductosDialogComponent, {
      header: 'Detalle de productos',
      width: '480px',
      modal: true,
      data: { productos: productosData }
    });

    ref.onClose.subscribe((result: { items: { productoId: number; cantidad: number }[]; total: number } | null) => {
      if (result !== null && result !== undefined) {
        // Rebuild the FormArray with the updated quantities
        this.productosArray.clear();
        result.items.forEach(item => {
          this.productosArray.push(
            this.fb.group({
              productoId: [item.productoId],
              cantidad: [item.cantidad]
            })
          );
        });

        // Update total in the pedido form group
        this.pedidoForm.get('pedido')?.patchValue({ total: result.total } as any);
      }
    });
  }
}
