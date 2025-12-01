import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent implements OnInit {
  user: any = {
    nombre: 'Usuario',
    email: 'correo@example.com',
    miembroDesde: 'Enero 2023',
    puntos: 1250,
    nivel: 10,
    siguienteNivel: 3250
  };

  ngOnInit(): void {
    // Here you would fetch user data from a service
    // const userData = localStorage.getItem('user');
    // if (userData) {
    //   this.user = JSON.parse(userData);
    // }
  }
}
