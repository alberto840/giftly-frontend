import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UbicacionService } from '../../services/ubicacion/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import * as L from 'leaflet';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { PedidoRegistroRequest } from '../../models/pedido.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule, CommonModule, RouterModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  //obtener user id del localStorage
  public usuarioId: number = JSON.parse(localStorage.getItem('user') || '{}').id;

  public ubicaciones: Ubicacion[] = [];

  private map!: L.Map;
  private marker?: L.Marker;

  // Variables donde se guardará la ubicación
  public latitud: number | null = null;
  public longitud: number | null = null;

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
    this.initMap();
    const navigation = this.router.getCurrentNavigation();
    const data = window.history.state['pedido'] as PedidoRegistroRequest;

    if (data) {
      this.cargarDatosEnFormulario(data);

      // 1. Llenar ubicaciones si tenemos el usuarioId
      const usuarioId = this.usuarioId;
      if (this.usuarioId && this.usuarioId !== 1) {
        this.obtenerUbicaciones(this.usuarioId);
        // Actualizamos el usuarioId en el locationForm para cuando cree una nueva
        this.locationForm.patchValue({ usuarioId: this.usuarioId });
      } else {
        // Si es invitado, nos aseguramos de que las ubicaciones estén vacías
        this.ubicaciones = [];
      }
    }
  }

  obtenerUbicaciones(usuarioId: number) {
    this.ubicacionService.getByUsuarioId(usuarioId).subscribe({
      next: (res) => {
        // Ajusta 'res.data' según el nombre de la propiedad en tu ApiResponse
        this.ubicaciones = res.data;
        console.log('Ubicaciones cargadas:', this.ubicaciones);
      },
      error: (err) => console.error('Error al cargar ubicaciones', err)
    });
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

  private initMap(): void {
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
    // 1. Inicializar el objeto mapa
    this.map = L.map('map').setView([0, 0], 2);

    // 2. Añadir capa de diseño (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 3. Evento de clic
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.addMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private addMarker(lat: number, lng: number): void {
    // Guardar en variables
    this.latitud = lat;
    this.longitud = lng;

    console.log(`Coordenadas guardadas: Lat ${this.latitud}, Lng ${this.longitud}`);

    this.locationForm.patchValue({
      latitud: lat.toString(),
      longitud: lng.toString()
    });

    // Si ya existe un pin, lo movemos; si no, lo creamos
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  locationForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private ubicacionService: UbicacionService,
  ) {
    this.locationForm = this.fb.group({
      id: [null],
      longitud: ['', Validators.required],
      latitud: ['', Validators.required],
      detalle: ['', Validators.required],
      referencia: ['referencia', Validators.required],
      usuarioId: [this.usuarioId ? this.usuarioId : null, Validators.required]
    });
  }

  onSubmit() {
    const ubicacionSeleccionadaId = this.pedidoForm.get('detallePedido.ubicacionId')?.value;
    const dataEnvio = {
      pedido: this.pedidoForm.value,
      nuevaUbicacion: this.locationForm.value
    };
    //si ubicacionid es diferente a null o 0, entonces se debe guardar la ubicacion
    // 1. Si seleccionó una ubicación existente del Dropdown
    if (ubicacionSeleccionadaId) {
      console.log('Usando ubicación guardada:', ubicacionSeleccionadaId);
      this.router.navigate(['/more-details'], { state: { data: dataEnvio } });
    }
    // 2. Si no hay selección previa, debe validar el formulario de "Nueva Ubicación"
    else if (this.locationForm.valid) {
      console.log('Usando nueva ubicación del mapa');
      this.router.navigate(['/more-details'], { state: { data: dataEnvio } });
    }
    else {
      this.errorMessage = 'Selecciona una ubicación guardada o marca una nueva en el mapa';
      this.locationForm.markAllAsTouched();
    }
  }

  navigateForward() {
    this.router.navigate(['/more-details']);
  }

  navigateBack() {
    this.router.navigate(['/message']);
  }

  openDialog() {
    this.dialogService.open(InfoDialogComponent, {
      showHeader: false,
      modal: true,
      data: {
        type: 'location'
      }
    });
  }
}
