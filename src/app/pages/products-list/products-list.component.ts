import { Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
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
export class ProductsListComponent {
  products: any[] = [];
  availableCategories: string[] = [];
  searchQuery: string = '';
  images: string[] = [];
  currentIndex = 0;
  selectedProduct: any = null;
  originalProducts: any[] = [];

  minPrice: number = 0;
  maxPrice: number = 2000;
  sliderOptions: any = {
    floor: 0,
    ceil: 2000,
    step: 10,
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  async ngOnInit() {
    this.products = await this.productService.getProducts();
    this.originalProducts = [...this.products];

    this.images = this.products.map((product: any) => product.image);

    this.products.map((product: any) => {
      if (!this.availableCategories.includes(product.category)) this.availableCategories.push(product.category)
      return product
    });

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  filterProducts(event: any) {
    const searchQuery = event.target.value.trim().toLowerCase();

    if (!searchQuery) {
      this.products = [...this.originalProducts];
      return;
    }

    this.products = this.originalProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery)
    );
  }

  // Category Filter
  filterByCategory(event: any) {
    const category = event.target.value;
    this.products = category
      ? this.originalProducts.filter((product) => product.category === category)
      : [...this.originalProducts];
  }

  // Sort by Price
  sortByPrice(event: any) {
    const order = event.target.value;
    if (!order) {
      this.products = [...this.originalProducts];
      return;
    }
    this.products = [...this.products].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
  }

  filteredProducts() {
    this.products = this.originalProducts.filter(
      (product) =>
        product.price >= this.minPrice &&
        product.price <= this.maxPrice
    );
  }

  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
