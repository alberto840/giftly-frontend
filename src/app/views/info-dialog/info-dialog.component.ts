import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, AvatarModule],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.css'
})
export class InfoDialogComponent {
  private config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  type: string = this.config.data.type;
}
