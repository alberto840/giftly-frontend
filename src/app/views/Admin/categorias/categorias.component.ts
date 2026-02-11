import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/categoria.modelo';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-categorias',
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
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {
  items: MenuItem[] | undefined;

  categorias: Categoria[] = [];
  categoria: Categoria = {} as Categoria;
  selectedCategorias: Categoria[] = [];

  categoriaDialog: boolean = false;
  submitted: boolean = false;
  deleteCategoriaDialog: boolean = false;

  form: FormGroup;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
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
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las categorías' });
      }
    });
  }

  openNew() {
    this.categoria = {} as Categoria;
    this.submitted = false;
    this.categoriaDialog = true;
    this.form.reset();
  }

  editCategoria(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.form.patchValue(this.categoria);
    this.categoriaDialog = true;
  }

  deleteCategoria(categoria: Categoria) {
    this.deleteCategoriaDialog = true;
    this.categoria = { ...categoria };
  }

  confirmDelete() {
    this.deleteCategoriaDialog = false;
    if (this.categoria.id) {
      this.categoriaService.eliminar(this.categoria.id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter(val => val.id !== this.categoria.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Categoría Eliminada', life: 3000 });
          this.categoria = {} as Categoria;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría' });
        }
      });
    }
  }

  hideDialog() {
    this.categoriaDialog = false;
    this.submitted = false;
  }

  saveCategoria() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;

      if (this.categoria.id) {
        // Update
        this.categoriaService.actualizar(this.categoria.id, { ...this.categoria, ...formValue }).subscribe({
          next: (res) => {
            const index = this.categorias.findIndex(c => c.id === this.categoria.id);
            if (index !== -1) {
              this.categorias[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Categoría Actualizada', life: 3000 });
            this.categorias = [...this.categorias];
            this.categoriaDialog = false;
            this.categoria = {} as Categoria;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
          }
        });
      } else {
        // Create
        this.categoriaService.crear(formValue).subscribe({
          next: (res) => {
            this.categorias.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Categoría Creada', life: 3000 });
            this.categorias = [...this.categorias];
            this.categoriaDialog = false;
            this.categoria = {} as Categoria;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
