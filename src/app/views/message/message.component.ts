import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule, TextareaModule, FloatLabelModule, InputTextModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  value!: string;
  private router = inject(Router);
  private dialogService = inject(DialogService);
  navigateForward() {
    this.router.navigate(['/location']);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  openDialog() {
    this.dialogService.open(InfoDialogComponent, {
      width: '400px',
      modal: true,
      data: {
        type: 'message'
      }
    });
  }
}
