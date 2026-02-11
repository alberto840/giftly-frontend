import { Component, OnInit } from '@angular/core';
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
import { RolService } from '../../../services/rol/rol.service';
import { Rol } from '../../../models/rol.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-rol',
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
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  roles: Rol[] = [];
  rol: Rol = {} as Rol;
  
  rolDialog: boolean = false;
  submitted: boolean = false;
  deleteRolDialog: boolean = false;

  form: FormGroup;

  constructor(
    private rolService: RolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required]
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
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los roles' });
      }
    });
  }

  openNew() {
    this.rol = {} as Rol;
    this.submitted = false;
    this.rolDialog = true;
    this.form.reset();
  }

  editRol(rol: Rol) {
    this.rol = { ...rol };
    this.form.patchValue({
        descripcion: this.rol.descripcion
    });
    this.rolDialog = true;
  }

  deleteRol(rol: Rol) {
    this.deleteRolDialog = true;
    this.rol = { ...rol };
  }

  confirmDelete() {
    this.deleteRolDialog = false;
    if (this.rol.id) {
      this.rolService.eliminar(this.rol.id).subscribe({
        next: () => {
          this.roles = this.roles.filter(val => val.id !== this.rol.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Eliminado', life: 3000 });
          this.rol = {} as Rol;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol' });
        }
      });
    }
  }

  hideDialog() {
    this.rolDialog = false;
    this.submitted = false;
  }

  saveRol() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      const rolToSave: Rol = {
          ...this.rol,
          ...formValue
      };
      
      if (this.rol.id) {
        // Update
        this.rolService.actualizar(this.rol.id, rolToSave).subscribe({
          next: (res) => {
            const index = this.roles.findIndex(c => c.id === this.rol.id);
            if(index !== -1) {
              this.roles[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Actualizado', life: 3000 });
            this.roles = [...this.roles];
            this.rolDialog = false;
            this.rol = {} as Rol;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el rol' });
          }
        });
      } else {
        // Create
        this.rolService.crear(rolToSave).subscribe({
          next: (res) => {
            this.roles.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Creado', life: 3000 });
            this.roles = [...this.roles];
            this.rolDialog = false;
            this.rol = {} as Rol;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el rol' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
