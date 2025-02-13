import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { NotificationComponent } from './components/notification/notification.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NotificationComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  thisYear = new Date().getFullYear();

  constructor(private cartService: CartService) {}
  cartItems: any[] = []

  ngOnInit(): void {
    this.cartService.cart$.subscribe((data) => {
      this.cartItems = data;
    });
  }
}
