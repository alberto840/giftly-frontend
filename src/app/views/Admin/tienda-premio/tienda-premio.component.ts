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
import { TiendaPremioService } from '../../../services/tienda_premio/tienda-premio.service';
import { TiendaPremio } from '../../../models/tienda_premio.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-tienda-premio',
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
  templateUrl: './tienda-premio.component.html',
  styleUrl: './tienda-premio.component.css'
})
export class TiendaPremioComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  tiendaPremios: TiendaPremio[] = [];
  tiendaPremio: TiendaPremio = {} as TiendaPremio;
  
  tiendaPremioDialog: boolean = false;
  submitted: boolean = false;
  deleteTiendaPremioDialog: boolean = false;

  form: FormGroup;

  constructor(
    private tiendaPremioService: TiendaPremioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      precioPunto: [0, [Validators.required, Validators.min(0)]],
      productoId: [null, Validators.required]
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
    this.tiendaPremioService.getAll().subscribe({
      next: (data) => {
        this.tiendaPremios = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los premios de tienda' });
      }
    });
  }

  openNew() {
    this.tiendaPremio = {} as TiendaPremio;
    this.submitted = false;
    this.tiendaPremioDialog = true;
    this.form.reset();
  }

  editTiendaPremio(tiendaPremio: TiendaPremio) {
    this.tiendaPremio = { ...tiendaPremio };
    this.form.patchValue({
        precioPunto: this.tiendaPremio.precioPunto,
        productoId: this.tiendaPremio.productoId
    });
    this.tiendaPremioDialog = true;
  }

  deleteTiendaPremio(tiendaPremio: TiendaPremio) {
    this.deleteTiendaPremioDialog = true;
    this.tiendaPremio = { ...tiendaPremio };
  }

  confirmDelete() {
    this.deleteTiendaPremioDialog = false;
    if (this.tiendaPremio.id) {
      this.tiendaPremioService.eliminar(this.tiendaPremio.id).subscribe({
        next: () => {
          this.tiendaPremios = this.tiendaPremios.filter(val => val.id !== this.tiendaPremio.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Premio Eliminado', life: 3000 });
          this.tiendaPremio = {} as TiendaPremio;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el premio' });
        }
      });
    }
  }

  hideDialog() {
    this.tiendaPremioDialog = false;
    this.submitted = false;
  }

  saveTiendaPremio() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      const tiendaPremioToSave: TiendaPremio = {
          ...this.tiendaPremio,
          ...formValue
      };
      
      if (this.tiendaPremio.id) {
        // Update
        this.tiendaPremioService.actualizar(this.tiendaPremio.id, tiendaPremioToSave).subscribe({
          next: (res) => {
            const index = this.tiendaPremios.findIndex(c => c.id === this.tiendaPremio.id);
            if(index !== -1) {
              this.tiendaPremios[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Premio Actualizado', life: 3000 });
            this.tiendaPremios = [...this.tiendaPremios];
            this.tiendaPremioDialog = false;
            this.tiendaPremio = {} as TiendaPremio;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el premio' });
          }
        });
      } else {
        // Create
        this.tiendaPremioService.crear(tiendaPremioToSave).subscribe({
          next: (res) => {
            this.tiendaPremios.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Premio Creado', life: 3000 });
            this.tiendaPremios = [...this.tiendaPremios];
            this.tiendaPremioDialog = false;
            this.tiendaPremio = {} as TiendaPremio;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el premio' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
