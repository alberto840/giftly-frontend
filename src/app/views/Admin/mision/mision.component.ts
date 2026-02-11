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
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MisionService } from '../../../services/mision/mision.service';
import { Mision } from '../../../models/mision.model';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-mision',
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
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mision.component.html',
  styleUrl: './mision.component.css'
})
export class MisionComponent implements OnInit {
  items: MenuItem[] | undefined;
  
  misiones: Mision[] = [];
  mision: Mision = {} as Mision;
  selectedMisiones: Mision[] = [];
  
  misionDialog: boolean = false;
  submitted: boolean = false;
  deleteMisionDialog: boolean = false;

  form: FormGroup;

  constructor(
    private misionService: MisionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      objetivo: ['', Validators.required],
      descripcion: ['', Validators.required],
      premioPunt: [0, [Validators.required, Validators.min(0)]],
      fechaFinal: ['', Validators.required]
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
    this.misionService.getAll().subscribe({
      next: (data) => {
        this.misiones = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las misiones' });
      }
    });
  }

  openNew() {
    this.mision = {} as Mision;
    this.submitted = false;
    this.misionDialog = true;
    this.form.reset();
  }

  editMision(mision: Mision) {
    this.mision = { ...mision };
    
    // Ensure date format is compatible if needed, or if it comes as string yyyy-mm-dd it might work directly with p-calendar or native date input
    // If it's a timestamp or different format, further processing might be needed.
    // Assuming backend returns 'yyyy-MM-dd' string as per interface comment, or Date object.
    // If it's a string 'yyyy-MM-dd', we might need to create a Date object for p-calendar
    if (this.mision.fechaFinal) {
        // simple check if it needs conversion, though p-calendar handles Date objects best
        // if string is returned, let's try to pass it directly first
    }

    this.form.patchValue({
        titulo: this.mision.titulo,
        objetivo: this.mision.objetivo,
        descripcion: this.mision.descripcion,
        premioPunt: this.mision.premioPunt,
        fechaFinal: this.mision.fechaFinal // Might need new Date(this.mision.fechaFinal) if using p-calendar with date object
    });
    this.misionDialog = true;
  }

  deleteMision(mision: Mision) {
    this.deleteMisionDialog = true;
    this.mision = { ...mision };
  }

  confirmDelete() {
    this.deleteMisionDialog = false;
    if (this.mision.id) {
      this.misionService.eliminar(this.mision.id).subscribe({
        next: () => {
          this.misiones = this.misiones.filter(val => val.id !== this.mision.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Misión Eliminada', life: 3000 });
          this.mision = {} as Mision;
        },
        error: (e) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la misión' });
        }
      });
    }
  }

  hideDialog() {
    this.misionDialog = false;
    this.submitted = false;
  }

  saveMision() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Handle Date conversion if necessary. 
      // API expects java.sql.Date which is typically 'yyyy-MM-dd'.
      // If p-calendar returns a Date object, we should format it.
      let fechaFinalStr = formValue.fechaFinal;
      if (formValue.fechaFinal instanceof Date) {
          fechaFinalStr = formValue.fechaFinal.toISOString().split('T')[0];
      }

      const misionToSave: Mision = {
          ...this.mision,
          ...formValue,
          fechaFinal: fechaFinalStr
      };
      
      if (this.mision.id) {
        // Update
        this.misionService.actualizar(this.mision.id, misionToSave).subscribe({
          next: (res) => {
            const index = this.misiones.findIndex(c => c.id === this.mision.id);
            if(index !== -1) {
              this.misiones[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Misión Actualizada', life: 3000 });
            this.misiones = [...this.misiones];
            this.misionDialog = false;
            this.mision = {} as Mision;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la misión' });
          }
        });
      } else {
        // Create
        this.misionService.crear(misionToSave).subscribe({
          next: (res) => {
            this.misiones.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Misión Creada', life: 3000 });
            this.misiones = [...this.misiones];
            this.misionDialog = false;
            this.mision = {} as Mision;
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la misión' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
