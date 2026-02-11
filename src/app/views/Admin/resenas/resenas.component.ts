import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ResenaService } from '../../../services/resena/resena.service';
import { Resena } from '../../../models/resena.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-resenas',
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
    InputTextarea,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './resenas.component.html',
  styleUrl: './resenas.component.css'
})
export class ResenasComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  resenas: Resena[] = [];
  resena: Resena = {} as Resena;
  
  resenaDialog: boolean = false;
  submitted: boolean = false;
  deleteResenaDialog: boolean = false;

  form: FormGroup;

  constructor(
    private resenaService: ResenaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      calificacion: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      comentario: ['', Validators.required],
      usuarioId: [null, Validators.required],
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
    this.resenaService.getAll().subscribe({
      next: (data) => {
        this.resenas = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las reseñas' });
      }
    });
  }

  openNew() {
    this.resena = {} as Resena;
    this.submitted = false;
    this.resenaDialog = true;
    this.form.reset();
  }

  editResena(resena: Resena) {
    this.resena = { ...resena };
    this.form.patchValue({
        calificacion: this.resena.calificacion,
        comentario: this.resena.comentario,
        usuarioId: this.resena.usuarioId,
        productoId: this.resena.productoId
    });
    this.resenaDialog = true;
  }

  deleteResena(resena: Resena) {
    this.deleteResenaDialog = true;
    this.resena = { ...resena };
  }

  confirmDelete() {
    this.deleteResenaDialog = false;
    if (this.resena.id) {
      this.resenaService.eliminar(this.resena.id).subscribe({
        next: () => {
          this.resenas = this.resenas.filter(val => val.id !== this.resena.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Reseña Eliminada', life: 3000 });
          this.resena = {} as Resena;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la reseña' });
        }
      });
    }
  }

  hideDialog() {
    this.resenaDialog = false;
    this.submitted = false;
  }

  saveResena() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      const resenaToSave: Resena = {
          ...this.resena,
          ...formValue
      };
      
      if (this.resena.id) {
        // Update
        this.resenaService.actualizar(this.resena.id, resenaToSave).subscribe({
          next: (res) => {
            const index = this.resenas.findIndex(c => c.id === this.resena.id);
            if(index !== -1) {
              this.resenas[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Reseña Actualizada', life: 3000 });
            this.resenas = [...this.resenas];
            this.resenaDialog = false;
            this.resena = {} as Resena;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la reseña' });
          }
        });
      } else {
        // Create
        this.resenaService.crear(resenaToSave).subscribe({
          next: (res) => {
            this.resenas.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Reseña Creada', life: 3000 });
            this.resenas = [...this.resenas];
            this.resenaDialog = false;
            this.resena = {} as Resena;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la reseña' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
