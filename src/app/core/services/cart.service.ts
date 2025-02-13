import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private notificationService: NotificationService) { }

  private storageKey = 'cart';

  private cartSubject = new BehaviorSubject<any[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]')
  );

  cart$ = this.cartSubject.asObservable();

  updateData(newArray: any[]): void {
    this.cartSubject.next(newArray);
    localStorage.setItem(this.storageKey, JSON.stringify(newArray));
  }

  addToCart(product: any): void {
    const existingProduct = this.cartSubject.value.find((item: any) => item.id === product.id);

    if (existingProduct) {
      this.notificationService.show({
        type: 'warning',
        message: 'The product already exists inside the cart!',
      });
    } else {
      const updatedArray = [...this.cartSubject.value, product];
      this.updateData(updatedArray);
      this.notificationService.show({
        type: 'success',
        message: 'Product added to cart!',
      });
    }
  }

  removeFromCart(itemToRemove: any): void {
    const updatedArray = this.cartSubject.value.filter(item => item !== itemToRemove);
    this.updateData(updatedArray);
    this.notificationService.show({
      type: 'info',
      message: 'Product removed from cart!',
    });
  }

  clearCart() {
    this.updateData([]);
    this.notificationService.show({
      type: 'info',
      message: 'Cart has been cleared!',
    });
  }
}
