import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ProductoService } from '../../../services/producto/producto.service';
import { Producto } from '../../../models/producto.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  productos: Producto[] = [];
  producto: Producto = {} as Producto;
  
  productoDialog: boolean = false;
  submitted: boolean = false;
  deleteProductoDialog: boolean = false;

  form: FormGroup;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required],
      imgUrl: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAll();
    this.items = [
      {
        label: 'Usuarios',
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            command: () => {
              this.goToRoute('/usuarios');
            }
          },
          {
            label: 'Roles',
            icon: 'pi pi-user',
            command: () => {
              this.goToRoute('/roles');
            }
          },
          {
            label: 'Referidos',
            icon: 'pi pi-users',
            command: () => {
              this.goToRoute('/referidos');
            }
          }
        ]
      },
      {
        label: 'Regalos',
        items: [
          {
            label: 'Productos',
            icon: 'pi pi-gift',
            command: () => {
              this.goToRoute('/productos');
            }
          },
          {
            label: 'Pedidos',
            icon: 'pi pi-shopping-cart',
            command: () => {
              this.goToRoute('/pedidos');
            }
          },
          {
            label: 'Categorias',
            icon: 'pi pi-tag',
            command: () => {
              this.goToRoute('/categorias');
            }
          }
        ]
      },
      {
        label: 'Game',
        items: [
          {
            label: 'Misiones',
            icon: 'pi pi-list-check',
            command: () => {
              this.goToRoute('/misiones');
            }
          },
          {
            label: 'Premios',
            icon: 'pi pi-tags',
            command: () => {
              this.goToRoute('/tienda-premio');
            }
          },
          {
            label: 'Tienda',
            icon: 'pi pi-shopping-bag',
            command: () => {
              this.goToRoute('/tienda');
            }
          }
        ]
      },
      {
        label: 'Giftly',
        items: [
          {
            label: 'Reseñas',
            icon: 'pi pi-comments',
            command: () => {
              this.goToRoute('/resenas');
            }
          },
          {
            label: 'Qr',
            icon: 'pi pi-qrcode',
            command: () => {
              this.goToRoute('/qr');
            }
          }
        ]
      }
    ];
  }

  goToRoute(route: string) {
    this.router.navigate([route]);
  }

  getAll() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los productos' });
      }
    });
  }

  openNew() {
    this.producto = {} as Producto;
    this.submitted = false;
    this.productoDialog = true;
    this.form.reset();
  }

  editProducto(producto: Producto) {
    this.producto = { ...producto };
    this.form.patchValue({
        nombre: this.producto.nombre,
        stock: this.producto.stock,
        precio: this.producto.precio,
        categoriaId: this.producto.categoriaId,
        imgUrl: this.producto.imgUrl
    });
    this.productoDialog = true;
  }

  deleteProducto(producto: Producto) {
    this.deleteProductoDialog = true;
    this.producto = { ...producto };
  }

  confirmDelete() {
    this.deleteProductoDialog = false;
    if (this.producto.id) {
      this.productoService.eliminar(this.producto.id).subscribe({
        next: () => {
          this.productos = this.productos.filter(val => val.id !== this.producto.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto Eliminado', life: 3000 });
          this.producto = {} as Producto;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' });
        }
      });
    }
  }

  hideDialog() {
    this.productoDialog = false;
    this.submitted = false;
  }

  saveProducto() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      const productoToSave: Producto = {
          ...this.producto,
          ...formValue
      };
      
      if (this.producto.id) {
        // Update
        this.productoService.actualizar(this.producto.id, productoToSave).subscribe({
          next: (res) => {
            const index = this.productos.findIndex(c => c.id === this.producto.id);
            if(index !== -1) {
              this.productos[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto Actualizado', life: 3000 });
            this.productos = [...this.productos];
            this.productoDialog = false;
            this.producto = {} as Producto;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto' });
          }
        });
      } else {
        // Create
        this.productoService.crear(productoToSave).subscribe({
          next: (res) => {
            this.productos.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto Creado', life: 3000 });
            this.productos = [...this.productos];
            this.productoDialog = false;
            this.producto = {} as Producto;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
