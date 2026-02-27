import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/producto.model';
import { forkJoin } from 'rxjs';

export interface ProductoDialogItem {
  productoId: number;
  cantidad: number;
  producto?: Producto;
}

@Component({
  selector: 'app-productos-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './productos-dialog.component.html',
  styleUrl: './productos-dialog.component.css'
})
export class ProductosDialogComponent implements OnInit {
  private config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private productoService = inject(ProductoService);

  public items: ProductoDialogItem[] = [];
  public loading = true;

  ngOnInit(): void {
    const rawItems: { productoId: number; cantidad: number }[] =
      this.config.data?.productos ?? [];

    if (rawItems.length === 0) {
      this.loading = false;
      return;
    }

    const requests = rawItems.map(item =>
      this.productoService.getById(item.productoId)
    );

    forkJoin(requests).subscribe({
      next: (productos: Producto[]) => {
        this.items = rawItems.map((item, i) => ({
          ...item,
          producto: productos[i]
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  get total(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.producto?.precio ?? 0) * item.cantidad;
    }, 0);
  }

  incrementar(index: number): void {
    this.items[index].cantidad++;
  }

  decrementar(index: number): void {
    this.items[index].cantidad--;
    if (this.items[index].cantidad <= 0) {
      this.items.splice(index, 1);
    }
  }

  confirmar(): void {
    const result = {
      items: this.items.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      })),
      total: this.total
    };
    this.ref.close(result);
  }

  cerrar(): void {
    this.ref.close(null);
  }
}
