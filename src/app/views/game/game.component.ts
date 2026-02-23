import { FormArray, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timeline } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/producto.model';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  description?: string;
  type?: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [Fluid, InputNumber, PanelModule, CommonModule, Timeline, CardModule, ButtonModule, CarouselModule, TagModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  events: EventItem[];
  value1: number = 20;
  constructor(private productoService: ProductoService) {
    this.events = [
      { status: 'Inicio', date: '15/10/2020 10:30', icon: 'fa-solid fa-circle-play', color: '#9C27B0', description: 'En esta plataforma puedes adquirir regalos para tus seres queridos y ademas ganar recompensas por tus compras! Que esperas para darle una sorpresa a esa persona especial?' },
      { status: 'Souvenir', date: '16/10/2020 10:00', icon: 'fa-solid fa-gift', color: '#3ab7a6ff', description: 'Necesitas un souvenir? Tenemos lo indicado para esa persona', type: 1 },
      { status: 'Flores', date: '15/10/2020 14:00', icon: 'fa-solid fa-fan', color: '#673AB7', description: 'Tenemos una variedad de flores para ti', type: 4 },
      { status: 'Comestibles', date: '15/10/2020 14:00', icon: 'fa-solid fa-utensils', color: '#FF9800', description: 'Tenemos una variedad de comestibles para ti', type: 2 },
      { status: 'Bebidas', date: '15/10/2020 16:15', icon: 'fa-solid fa-wine-glass', color: '#b73e3aff', description: 'Tenemos una variedad de bebidas para ti', type: 3 },
    ];
  }

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
    productos: this.fb.array([]) // Array dinámico
  });

  get productosFormArray() {
    return this.pedidoForm.controls.productos as FormArray;
  }

  onQuantityChange(product: Producto, event: any) {
    console.log('Evento recibido:', event);
    console.log('Producto:', product);
    // Extraemos el valor numérico sin importar cómo venga el evento
    const val = (event && typeof event === 'object' && 'value' in event) ? event.value : event;
    const numVal = Number(val) || 0;

    const productosArray = this.productosFormArray;
    const index = productosArray.controls.findIndex(
      (ctrl) => ctrl.get('productoId')?.value === product.id
    );

    if (numVal > 0) {
      if (index !== -1) {
        // Actualizamos solo si el valor es distinto para evitar bucles infinitos
        if (productosArray.at(index).get('cantidad')?.value !== numVal) {
          productosArray.at(index).get('cantidad')?.setValue(numVal);
          console.log('Cantidad actualizada:', productosArray.at(index).value);
        }
      } else {
        // Agregamos el nuevo producto al FormArray
        const nuevoProducto = this.fb.group({
          productoId: [product.id, Validators.required],
          cantidad: [numVal, [Validators.required, Validators.min(1)]]
        });
        productosArray.push(nuevoProducto);
        console.log('Producto agregado:', nuevoProducto.value);
      }
    } else if (index !== -1) {
      // Si la cantidad es 0, lo eliminamos
      this.removeProducto(index);
    }

    // Sincronizamos el estado del formulario global
    this.pedidoForm.updateValueAndValidity();
  }

  actualizarTotal() {
    // Lógica opcional para sumar precios si tienes el objeto producto a mano
    console.log('Productos en el form:', this.productosFormArray.value);
  }

  getProductQuantity(productoId: number): number {
    const control = this.productosFormArray.controls.find(
      (ctrl) => ctrl.get('productoId')?.value === productoId
    );
    return control ? control.get('cantidad')?.value : 0;
  }

  // Método para remover un producto (para ver si agregar)
  removeProducto(index: number) {
    this.productosFormArray.removeAt(index);
  }

  souvenirs: Producto[] = [];
  flores: Producto[] = [];
  comestibles: Producto[] = [];
  bebidas: Producto[] = [];

  ngOnInit() {
    this.productoService.getAll().subscribe({
      next: (response) => {
        console.log('Productos', response);
        this.souvenirs = response.filter((producto: Producto) => producto.categoriaId === 1);
        this.flores = response.filter((producto: Producto) => producto.categoriaId === 4);
        this.comestibles = response.filter((producto: Producto) => producto.categoriaId === 2);
        this.bebidas = response.filter((producto: Producto) => producto.categoriaId === 3);
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      const data = this.pedidoForm.value;
      console.log(data);
      this.router.navigate(['/message'], { state: { pedido: data } });
    } else {
      console.log('Formulario inválido');
      this.pedidoForm.markAllAsTouched();
    }
  }

  navigateToMessage() {
    this.router.navigate(['/message']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
