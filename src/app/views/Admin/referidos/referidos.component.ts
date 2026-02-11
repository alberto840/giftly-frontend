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
import { ReferidoService } from '../../../services/referido/referido.service';
import { Referido } from '../../../models/referido.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-referidos',
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
  templateUrl: './referidos.component.html',
  styleUrl: './referidos.component.css'
})
export class ReferidosComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  referidos: Referido[] = [];
  referido: Referido = {} as Referido;
  
  referidoDialog: boolean = false;
  submitted: boolean = false;
  deleteReferidoDialog: boolean = false;

  form: FormGroup;

  constructor(
    private referidoService: ReferidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      cantidadInvita: [0, [Validators.required, Validators.min(0)]],
      usuarioId: [null, Validators.required],
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
    this.referidoService.getAll().subscribe({
      next: (data) => {
        this.referidos = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los referidos' });
      }
    });
  }

  openNew() {
    this.referido = {} as Referido;
    this.submitted = false;
    this.referidoDialog = true;
    this.form.reset();
  }

  editReferido(referido: Referido) {
    this.referido = { ...referido };
    this.form.patchValue({
        codigo: this.referido.codigo,
        cantidadInvita: this.referido.cantidadInvita,
        usuarioId: this.referido.usuarioId,
        rolId: this.referido.rolId
    });
    this.referidoDialog = true;
  }

  deleteReferido(referido: Referido) {
    this.deleteReferidoDialog = true;
    this.referido = { ...referido };
  }

  confirmDelete() {
    this.deleteReferidoDialog = false;
    if (this.referido.id) {
      this.referidoService.eliminar(this.referido.id).subscribe({
        next: () => {
          this.referidos = this.referidos.filter(val => val.id !== this.referido.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Referido Eliminado', life: 3000 });
          this.referido = {} as Referido;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el referido' });
        }
      });
    }
  }

  hideDialog() {
    this.referidoDialog = false;
    this.submitted = false;
  }

  saveReferido() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      const referidoToSave: Referido = {
          ...this.referido,
          ...formValue
      };
      
      if (this.referido.id) {
        // Update
        this.referidoService.actualizar(this.referido.id, referidoToSave).subscribe({
          next: (res) => {
            const index = this.referidos.findIndex(c => c.id === this.referido.id);
            if(index !== -1) {
              this.referidos[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Referido Actualizado', life: 3000 });
            this.referidos = [...this.referidos];
            this.referidoDialog = false;
            this.referido = {} as Referido;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el referido' });
          }
        });
      } else {
        // Create
        this.referidoService.crear(referidoToSave).subscribe({
          next: (res) => {
            this.referidos.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Referido Creado', life: 3000 });
            this.referidos = [...this.referidos];
            this.referidoDialog = false;
            this.referido = {} as Referido;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el referido' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
