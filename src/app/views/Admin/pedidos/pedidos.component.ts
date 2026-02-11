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
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PedidoService } from '../../../services/pedido/pedido.service';
import { Pedido } from '../../../models/pedido.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-pedidos',
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
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  pedidos: Pedido[] = [];
  pedido: Pedido = {} as Pedido;
  
  pedidoDialog: boolean = false;
  submitted: boolean = false;
  deletePedidoDialog: boolean = false;

  form: FormGroup;

  constructor(
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      fechaCreacion: ['', Validators.required],
      fechaEnvio: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      qrId: [null, Validators.required],
      usuarioId: [null, Validators.required],
      tiendaPremioId: [null, Validators.required]
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
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los pedidos' });
      }
    });
  }

  openNew() {
    this.pedido = {} as Pedido;
    this.submitted = false;
    this.pedidoDialog = true;
    this.form.reset();
  }

  editPedido(pedido: Pedido) {
    this.pedido = { ...pedido };
    this.form.patchValue({
        fechaCreacion: this.pedido.fechaCreacion,
        fechaEnvio: this.pedido.fechaEnvio,
        total: this.pedido.total,
        qrId: this.pedido.qrId,
        usuarioId: this.pedido.usuarioId,
        tiendaPremioId: this.pedido.tiendaPremioId
    });
    this.pedidoDialog = true;
  }

  deletePedido(pedido: Pedido) {
    this.deletePedidoDialog = true;
    this.pedido = { ...pedido };
  }

  confirmDelete() {
    this.deletePedidoDialog = false;
    if (this.pedido.id) {
      this.pedidoService.eliminar(this.pedido.id).subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(val => val.id !== this.pedido.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pedido Eliminado', life: 3000 });
          this.pedido = {} as Pedido;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el pedido' });
        }
      });
    }
  }

  hideDialog() {
    this.pedidoDialog = false;
    this.submitted = false;
  }

  savePedido() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      let fechaCreacionStr = formValue.fechaCreacion;
      if (formValue.fechaCreacion instanceof Date) {
          fechaCreacionStr = formValue.fechaCreacion.toISOString().split('T')[0];
      }
      let fechaEnvioStr = formValue.fechaEnvio;
      if (formValue.fechaEnvio instanceof Date) {
          fechaEnvioStr = formValue.fechaEnvio.toISOString().split('T')[0];
      }

      const pedidoToSave: Pedido = {
          ...this.pedido,
          ...formValue,
          fechaCreacion: fechaCreacionStr,
          fechaEnvio: fechaEnvioStr
      };
      
      if (this.pedido.id) {
        // Update
        this.pedidoService.actualizar(this.pedido.id, pedidoToSave).subscribe({
          next: (res) => {
            const index = this.pedidos.findIndex(c => c.id === this.pedido.id);
            if(index !== -1) {
              this.pedidos[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pedido Actualizado', life: 3000 });
            this.pedidos = [...this.pedidos];
            this.pedidoDialog = false;
            this.pedido = {} as Pedido;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el pedido' });
          }
        });
      } else {
        // Create
        this.pedidoService.crear(pedidoToSave).subscribe({
          next: (res) => {
            this.pedidos.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pedido Creado', life: 3000 });
            this.pedidos = [...this.pedidos];
            this.pedidoDialog = false;
            this.pedido = {} as Pedido;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el pedido' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
