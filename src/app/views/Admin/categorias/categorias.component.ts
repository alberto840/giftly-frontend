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
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/categoria.modelo';

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
    FormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {
  
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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAll();
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
            if(index !== -1) {
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
