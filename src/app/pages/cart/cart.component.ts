import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  animations: [
    trigger('modalAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.95)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', animate('400ms ease-in-out')),
      transition('* => void', animate('400ms ease-in-out')),
    ]),
    trigger('backdropAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('400ms ease-in-out')),
      transition('* => void', animate('400ms ease-in-out')),
    ]),
  ],
})
export class CartComponent implements OnInit {
  constructor(public cartService: CartService) {}
  cartItems: any[] = [];
  subTotal: number = 0
  discount: number = 0
  total: number = 0;
  showModal: boolean = false

  ngOnInit(): void {
    this.cartService.cart$.subscribe((data) => {
      this.cartItems = data;
    });

    this.calculateVariables();
  }

  calculateVariables() {
    this.subTotal = this.cartItems.reduce((acc, item) => acc + item.price, 0);
    this.discount = this.subTotal >= 100 ? this.subTotal * 0.1 : 0;
    this.total = this.subTotal - this.discount;
  }

  clearCart() {
    this.cartService.clearCart();
    this.calculateVariables();
  }

  removeFromCart(product: any) {
    this.cartService.removeFromCart(product)
    this.calculateVariables();
  }

  checkout() {
    this.cartService.clearCart();
    this.showModal = true
    this.calculateVariables();
  }

  closeModal() {
    this.showModal = false;
  }
}
