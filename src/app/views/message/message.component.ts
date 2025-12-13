import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  private router = inject(Router);
  navigateForward() {
    this.router.navigate(['/location']);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }
}
