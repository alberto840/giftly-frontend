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
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user/user.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-usuarios',
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
    CalendarModule,
    PasswordModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  usuarios: UsuarioModel[] = [];
  usuario: UsuarioModel = {} as UsuarioModel;
  
  usuarioDialog: boolean = false;
  submitted: boolean = false;
  deleteUsuarioDialog: boolean = false;

  form: FormGroup;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombreCompl: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimien: ['', Validators.required],
      puntos: [0, [Validators.required, Validators.min(0)]],
      rolId: [null, Validators.required]
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
    this.userService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los usuarios' });
      }
    });
  }

  openNew() {
    this.usuario = {} as UsuarioModel;
    this.submitted = false;
    this.usuarioDialog = true;
    this.form.reset();
  }

  editUsuario(usuario: UsuarioModel) {
    this.usuario = { ...usuario };
    this.form.patchValue({
        nombreCompl: this.usuario.nombreCompl,
        email: this.usuario.email,
        password: '', // Don't show password for editing usually, but if required by backend on update... handle accordingly. Assuming update might not require it or handled separately.
        fechaNacimien: this.usuario.fechaNacimien,
        puntos: this.usuario.puntos,
        rolId: this.usuario.rolId
    });
    // Maybe make password optional for edit? For now standard req.
    this.form.controls['password'].clearValidators();
    this.form.controls['password'].updateValueAndValidity();

    this.usuarioDialog = true;
  }

  deleteUsuario(usuario: UsuarioModel) {
    this.deleteUsuarioDialog = true;
    this.usuario = { ...usuario };
  }

  confirmDelete() {
    this.deleteUsuarioDialog = false;
    if (this.usuario.id) {
      this.userService.eliminar(this.usuario.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(val => val.id !== this.usuario.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Eliminado', life: 3000 });
          this.usuario = {} as UsuarioModel;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
        }
      });
    }
  }

  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
    // Reset password validator
    this.form.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
    this.form.controls['password'].updateValueAndValidity();
  }

  saveUsuario() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      let fechaNacimienStr = formValue.fechaNacimien;
      if (formValue.fechaNacimien instanceof Date) {
          fechaNacimienStr = formValue.fechaNacimien.toISOString().split('T')[0];
      }

      const usuarioToSave: UsuarioModel = {
          ...this.usuario,
          ...formValue,
          fechaNacimien: fechaNacimienStr
      };
      
      if (this.usuario.id) {
        // Update
        this.userService.actualizar(this.usuario.id, usuarioToSave).subscribe({
          next: (res) => {
            const index = this.usuarios.findIndex(c => c.id === this.usuario.id);
            if(index !== -1) {
              this.usuarios[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Actualizado', life: 3000 });
            this.usuarios = [...this.usuarios];
            this.usuarioDialog = false;
            this.usuario = {} as UsuarioModel;
            this.hideDialog(); // Reset validators
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario' });
          }
        });
      } else {
        // Create
        // Need to ensure backend accepts this on 'crear' endpoint. 
        // If creation is different (like register), this might need adjustment.
        // Assuming standard CRUD 'crear' works for admin user creation.
        this.userService.crear(usuarioToSave).subscribe({
          next: (res) => {
            this.usuarios.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Creado', life: 3000 });
            this.usuarios = [...this.usuarios];
            this.usuarioDialog = false;
            this.usuario = {} as UsuarioModel;
            this.hideDialog();
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el usuario' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
