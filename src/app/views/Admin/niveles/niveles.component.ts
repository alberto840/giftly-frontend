import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Router } from "@angular/router";
import { NivelService } from '../../../services/nivel/nivel.service';
import { Nivel } from '../../../models/niveles.model';

@Component({
  selector: 'app-niveles',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './niveles.component.html',
  styleUrl: './niveles.component.css'
})
export class NivelesComponent implements OnInit {
  items: MenuItem[] | undefined;

  niveles: Nivel[] = [];
  nivel: Nivel = {} as Nivel;

  nivelDialog: boolean = false;
  submitted: boolean = false;
  deleteNivelDialog: boolean = false;

  form: FormGroup;

  constructor(
    private nivelService: NivelService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      exp: [0, [Validators.required, Validators.min(0)]]
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
            command: () => this.goToRoute('/usuarios')
          },
          {
            label: 'Roles',
            icon: 'pi pi-user',
            command: () => this.goToRoute('/roles')
          },
          {
            label: 'Referidos',
            icon: 'pi pi-users',
            command: () => this.goToRoute('/referidos')
          }
        ]
      },
      {
        label: 'Regalos',
        items: [
          {
            label: 'Productos',
            icon: 'pi pi-gift',
            command: () => this.goToRoute('/productos')
          },
          {
            label: 'Pedidos',
            icon: 'pi pi-shopping-cart',
            command: () => this.goToRoute('/pedidos')
          },
          {
            label: 'Categorias',
            icon: 'pi pi-tag',
            command: () => this.goToRoute('/categorias')
          }
        ]
      },
      {
        label: 'Game',
        items: [
          {
            label: 'Misiones',
            icon: 'pi pi-list-check',
            command: () => this.goToRoute('/misiones')
          },
          {
            label: 'Premios',
            icon: 'pi pi-tags',
            command: () => this.goToRoute('/tienda-premio')
          },
          {
            label: 'Tienda',
            icon: 'pi pi-shopping-bag',
            command: () => this.goToRoute('/tienda')
          },
          {
            label: 'Niveles',
            icon: 'pi pi-star',
            command: () => this.goToRoute('/niveles')
          }
        ]
      }
    ];
  }

  goToRoute(route: string) {
    this.router.navigate([route]);
  }

  getAll() {
    this.nivelService.obtenerTodosLosNiveles().subscribe({
      next: (data) => {
        this.niveles = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los niveles' });
      }
    });
  }

  openNew() {
    this.nivel = {} as Nivel;
    this.submitted = false;
    this.nivelDialog = true;
    this.form.reset({ exp: 0 });
  }

  editNivel(nivel: Nivel) {
    this.nivel = { ...nivel };
    this.form.patchValue({
      nombre: this.nivel.nombre,
      exp: this.nivel.exp
    });
    this.nivelDialog = true;
  }

  deleteNivel(nivel: Nivel) {
    this.deleteNivelDialog = true;
    this.nivel = { ...nivel };
  }

  confirmDelete() {
    this.deleteNivelDialog = false;
    if (this.nivel.id) {
      this.nivelService.eliminarNivel(this.nivel.id).subscribe({
        next: () => {
          this.niveles = this.niveles.filter(val => val.id !== this.nivel.id);
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Nivel Eliminado', life: 3000 });
          this.nivel = {} as Nivel;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el nivel' });
        }
      });
    }
  }

  hideDialog() {
    this.nivelDialog = false;
    this.submitted = false;
  }

  saveNivel() {
    this.submitted = true;

    if (this.form.valid) {
      const formValue = this.form.value;
      const nivelToSave: Nivel = {
        ...this.nivel,
        ...formValue
      };

      if (this.nivel.id) {
        // Update
        this.nivelService.actualizarNivel(this.nivel.id, nivelToSave).subscribe({
          next: (res) => {
            const index = this.niveles.findIndex(c => c.id === this.nivel.id);
            if (index !== -1) {
              this.niveles[index] = res;
            }
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Nivel Actualizado', life: 3000 });
            this.niveles = [...this.niveles];
            this.nivelDialog = false;
            this.nivel = {} as Nivel;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el nivel' });
          }
        });
      } else {
        // Create
        this.nivelService.crearNivel(nivelToSave).subscribe({
          next: (res) => {
            this.niveles.push(res);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Nivel Creado', life: 3000 });
            this.niveles = [...this.niveles];
            this.nivelDialog = false;
            this.nivel = {} as Nivel;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el nivel' });
          }
        });
      }
    }
  }

  get f() { return this.form.controls; }
}
