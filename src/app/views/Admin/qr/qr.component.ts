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
import { QrService } from '../../../services/qr/qr.service';
import { Qr } from '../../../models/qr_model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-qr',
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
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  qrs: Qr[] = [];
  qr: Qr = {} as Qr;
  
  qrDialog: boolean = false;
  submitted: boolean = false;
  deleteQrDialog: boolean = false;

  form: FormGroup;

  constructor(
    private qrService: QrService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      fechaCreacion: ['', Validators.required],
      fechaExpiracion: ['', Validators.required],
      pedidoId: [null, Validators.required]
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
    this.qrService.getAll().subscribe({
      next: (data) => {
        this.qrs = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los QRs' });
      }
    });
  }

  openNew() {
    this.qr = {} as Qr;
    this.submitted = false;
    this.qrDialog = true;
    this.form.reset();
  }

  editQr(qr: Qr) {
    this.qr = { ...qr };
    this.form.patchValue({
        fechaCreacion: this.qr.fechaCreacion,
        fechaExpiracion: this.qr.fechaExpiracion,
        pedidoId: this.qr.pedidoId
    });
    this.qrDialog = true;
  }

  deleteQr(qr: Qr) {
    this.deleteQrDialog = true;
    this.qr = { ...qr };
  }

  confirmDelete() {
    this.deleteQrDialog = false;
    if (this.qr.id) {
      this.qrService.eliminar(this.qr.id).subscribe({
        next: () => {
          this.qrs = this.qrs.filter(val => val.id !== this.qr.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'QR Eliminado', life: 3000 });
          this.qr = {} as Qr;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el QR' });
        }
      });
    }
  }

  hideDialog() {
    this.qrDialog = false;
    this.submitted = false;
  }

  saveQr() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      let fechaCreacionStr = formValue.fechaCreacion;
      if (formValue.fechaCreacion instanceof Date) {
          fechaCreacionStr = formValue.fechaCreacion.toISOString().split('T')[0];
      }
      let fechaExpiracionStr = formValue.fechaExpiracion;
      if (formValue.fechaExpiracion instanceof Date) {
          fechaExpiracionStr = formValue.fechaExpiracion.toISOString().split('T')[0];
      }

      const qrToSave: Qr = {
          ...this.qr,
          ...formValue,
          fechaCreacion: fechaCreacionStr,
          fechaExpiracion: fechaExpiracionStr
      };
      
      if (this.qr.id) {
        // Update
        this.qrService.actualizar(this.qr.id, qrToSave).subscribe({
          next: (res) => {
            const index = this.qrs.findIndex(c => c.id === this.qr.id);
            if(index !== -1) {
              this.qrs[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'QR Actualizado', life: 3000 });
            this.qrs = [...this.qrs];
            this.qrDialog = false;
            this.qr = {} as Qr;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el QR' });
          }
        });
      } else {
        // Create
        this.qrService.crear(qrToSave).subscribe({
          next: (res) => {
            this.qrs.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'QR Creado', life: 3000 });
            this.qrs = [...this.qrs];
            this.qrDialog = false;
            this.qr = {} as Qr;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el QR' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
