import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timeline } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { Router } from '@angular/router';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  description?: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [Fluid, InputNumber, PanelModule, CommonModule, Timeline, CardModule, ButtonModule, CarouselModule, TagModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  private router = inject(Router);
  events: EventItem[];
  value1: number = 20;
  constructor() {
    this.events = [
      { status: 'Inicio', date: '15/10/2020 10:30', icon: 'fa-solid fa-circle-play', color: '#9C27B0', description: 'En esta plataforma puedes adquirir regalos para tus seres queridos y ademas ganar recompensas por tus compras! Que esperas para darle una sorpresa a esa persona especial?' },
      { status: 'Souvenir', date: '16/10/2020 10:00', icon: 'fa-solid fa-gift', color: '#3ab7a6ff', description: 'Necesitas un souvenir? Tenemos lo indicado para esa persona' },
      { status: 'Flores', date: '15/10/2020 14:00', icon: 'fa-solid fa-fan', color: '#673AB7', description: 'Tenemos una variedad de flores para ti' },
      { status: 'Comestibles', date: '15/10/2020 14:00', icon: 'fa-solid fa-utensils', color: '#FF9800', description: 'Tenemos una variedad de comestibles para ti' },
      { status: 'Bebidas', date: '15/10/2020 16:15', icon: 'fa-solid fa-wine-glass', color: '#b73e3aff', description: 'Tenemos una variedad de bebidas para ti' },
    ];
  }

  products: any[] = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
  ];

  ngOnInit() {

  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined;
    }
  }

  navigateToMessage() {
    this.router.navigate(['/message']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
