import { Injectable } from '@angular/core';
import axios from 'axios';
import { NotificationService } from './notification.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private notificationService: NotificationService, private loaderService: LoaderService) {}

  async getProducts() {
    try {
      this.loaderService.show()

      const response = await axios.get(this.apiUrl);

      this.loaderService.hide()

      return response.data.map((product: any) => ({
        ...product,
        price: product.price + (product.price * 2.2/100), // Add 2.2% to the price
      }));
    } catch (error) {
      this.loaderService.hide()
      this.notificationService.show({
        type: 'error',
        message: 'Sorry, an error occurs from our side while adding your product to the cart, we are currently working on it, Kindly try again.',
      })
      // console.error('Error fetching products:', error);
      throw error;
    }
  }

}
