import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  private map!: L.Map;
  private marker?: L.Marker;

  // Variables donde se guardará la ubicación
  public latitud: number | null = null;
  public longitud: number | null = null;
  ngOnInit() {
    this.initMap();
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
