import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido/pedido.service';
import { ProductoService } from '../../services/producto/producto.service';
import { UbicacionService } from '../../services/ubicacion/ubicacion.service';
import { Producto } from '../../models/producto.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-pedidos-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-usuario.component.html',
  styleUrl: './pedidos-usuario.component.css'
})
export class PedidosUsuarioComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoService = inject(ProductoService);
  private ubicacionService = inject(UbicacionService);
  private router = inject(Router);

  pedidos: any[] = [];
  productosMap = new Map<number, Producto>();
  ubicacionesMap = new Map<number, Ubicacion>();
  expandedOrderId: number | null = null;
  maps: { [key: number]: L.Map } = {};

  userId: number | null = null;
  loading = true;

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
        if (this.userId) {
          this.cargarPedidos();
        } else {
          this.loading = false;
        }
      } catch (e) {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  cargarPedidos() {
    console.log('Cargando pedidos para el usuario:', this.userId);
    this.pedidoService.getPedidosCompletos(this.userId!).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargarDatosAdicionales();
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.loading = false;
      }
    });
  }

  cargarDatosAdicionales() {
    const uniqueProductIds = Array.from(new Set<number>(
      this.pedidos.flatMap(p => p.productos?.map((prod: any) => prod.productoId) || [])
    ));

    const uniqueUbicacionIds = Array.from(new Set<number>(
      this.pedidos.map(p => p.detallePedido?.ubicacionId).filter(id => id != null)
    ));

    const requests: any = {};
    uniqueProductIds.forEach(id => {
      requests[`p_${id}`] = this.productoService.getById(id);
    });
    uniqueUbicacionIds.forEach(id => {
      requests[`u_${id}`] = this.ubicacionService.getById(id);
    });

    if (Object.keys(requests).length === 0) {
      this.loading = false;
      return;
    }

    forkJoin(requests).subscribe({
      next: (res: any) => {
        Object.keys(res).forEach(key => {
          if (key.startsWith('p_')) {
            const id = parseInt(key.split('_')[1]);
            this.productosMap.set(id, res[key]);
          } else if (key.startsWith('u_')) {
            const id = parseInt(key.split('_')[1]);
            this.ubicacionesMap.set(id, res[key]);
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos adicionales', err);
        this.loading = false;
      }
    });
  }

  toggleDetails(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
      const order = this.pedidos.find(p => p.pedido.id === orderId);
      if (order && order.detallePedido?.ubicacionId) {
        const ubicacion = this.ubicacionesMap.get(order.detallePedido.ubicacionId);
        if (ubicacion) {
          // Delay to ensure DOM element is ready
          setTimeout(() => {
            this.initMap(orderId, parseFloat(ubicacion.latitud), parseFloat(ubicacion.longitud));
          }, 100);
        }
      }
    }
  }

  initMap(orderId: number, lat: number, lng: number) {
    const containerId = `map-${orderId}`;
    if (this.maps[orderId]) {
      this.maps[orderId].remove();
    }

    const map = L.map(containerId).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    L.marker([lat, lng], { icon: iconDefault }).addTo(map);
    this.maps[orderId] = map;

    // Fix for map size issue when shown in hidden container initially
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  goBack() {
    this.router.navigate(['/']); // Redirigir al inicio por defecto
  }
}
