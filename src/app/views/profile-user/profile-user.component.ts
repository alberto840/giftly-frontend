import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { UserService } from '../../services/user/user.service';
import { NivelService } from '../../services/nivel/nivel.service';
import { TiendaPremioService } from '../../services/tienda_premio/tienda-premio.service';
import { ProductoService } from '../../services/producto/producto.service';

import { UsuarioModel } from '../../models/usuario.model';
import { Nivel } from '../../models/niveles.model';
import { TiendaPremio } from '../../models/tienda_premio.model';
import { Producto } from '../../models/producto.model';

export interface NivelConRecompensas extends Nivel {
  recompensas: TiendaPremio[];
}

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, ProgressBarModule, TagModule, TooltipModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent implements OnInit {

  private router = inject(Router);
  private userService = inject(UserService);
  private nivelService = inject(NivelService);
  private tiendaPremioService = inject(TiendaPremioService);
  private productoService = inject(ProductoService);

  public usuario: UsuarioModel | null = null;
  public niveles: NivelConRecompensas[] = [];
  public loading = true;

  // Dialog estado
  public dialogVisible = false;
  public dialogProducto: Producto | null = null;
  public dialogTienda: TiendaPremio | null = null;
  public loadingProducto = false;

  get usuarioId(): number {
    return JSON.parse(localStorage.getItem('user') || '{}').id;
  }

  get userExp(): number {
    return this.usuario?.exp ?? 0;
  }

  /** Nivel actual del usuario (el más alto cuyo exp <= userExp) */
  get nivelActualIndex(): number {
    let idx = 0;
    for (let i = 0; i < this.niveles.length; i++) {
      if (this.userExp >= this.niveles[i].exp) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }

  /** Progreso dentro del nivel actual hacia el siguiente nivel */
  getProgreso(nivel: NivelConRecompensas, index: number): number {
    const nextIndex = index + 1;
    if (nextIndex >= this.niveles.length) {
      // Último nivel: progreso basado en el exp del nivel actual
      const pct = Math.min(100, Math.round((this.userExp / nivel.exp) * 100));
      return pct;
    }
    const expActual = this.niveles[index].exp;
    const expSiguiente = this.niveles[nextIndex].exp;
    if (this.userExp < expActual) return 0;
    if (this.userExp >= expSiguiente) return 100;
    const pct = Math.round(((this.userExp - expActual) / (expSiguiente - expActual)) * 100);
    return pct;
  }

  /** Verifica si el usuario puede adquirir una recompensa */
  puedeAdquirir(tienda: TiendaPremio): boolean {
    return this.userExp >= tienda.precioExp;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    const id = this.usuarioId;

    // 1) Cargar usuario
    this.userService.getById(id).subscribe({
      next: (u) => {
        this.usuario = u;
        this.cargarNivelesYRecompensas();
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
        this.loading = false;
      }
    });
  }

  cargarNivelesYRecompensas(): void {
    // Cargar niveles y tiendas en paralelo
    let nivelesData: Nivel[] = [];
    let tiendasData: TiendaPremio[] = [];
    let nivelesOk = false;
    let tiendasOk = false;

    const combinar = () => {
      if (!nivelesOk || !tiendasOk) return;

      // Ordenar niveles por id
      const sorted = [...nivelesData].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

      // Asociar recompensas a cada nivel: las tiendas cuyo precioExp <= exp del nivel
      // Una recompensa pertenece al nivel X si precioExp <= nivel[X].exp y (X === 0 || precioExp > nivel[X-1].exp)
      this.niveles = sorted.map((n, i) => {
        const expAnterior = i === 0 ? 0 : sorted[i - 1].exp;
        const recompensas = tiendasData.filter(t => t.precioExp <= n.exp && t.precioExp > expAnterior);
        return { ...n, recompensas };
      });

      this.loading = false;
    };

    this.nivelService.obtenerTodosLosNiveles().subscribe({
      next: (data) => {
        nivelesData = data;
        nivelesOk = true;
        combinar();
      },
      error: (err) => {
        console.error('Error al cargar niveles', err);
        this.loading = false;
      }
    });

    this.tiendaPremioService.getAll().subscribe({
      next: (data) => {
        tiendasData = data;
        tiendasOk = true;
        combinar();
      },
      error: (err) => {
        console.error('Error al cargar tienda premios', err);
        this.loading = false;
      }
    });
  }

  abrirDialogRecompensa(tienda: TiendaPremio): void {
    this.dialogTienda = tienda;
    this.dialogProducto = null;
    this.dialogVisible = true;
    this.loadingProducto = true;

    this.productoService.getById(tienda.productoId).subscribe({
      next: (p) => {
        this.dialogProducto = p;
        this.loadingProducto = false;
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
        this.loadingProducto = false;
      }
    });
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.dialogProducto = null;
    this.dialogTienda = null;
  }

  reclamarRecompensa(): void {
    // TODO: implementar acción de reclamar
    console.log('Reclamar recompensa', this.dialogTienda);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/pedidos-usuario']);
  }
}
