import { Component, signal, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';
import { CartService } from '../../../services/cart/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  scrolled = signal(false);
  showUserMenu = signal(false);
  showMobileMenu = signal(false);

  isLoggedIn = this.authService.isLoggedIn;
  userName = this.authService.userName;
  cartCount = this.cartService.cartCount;

  ngOnInit() {
    // Eliminada carga de compras
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 80);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(v => !v);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }

  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.showUserMenu.set(false);
      this.showMobileMenu.set(false);
      this.router.navigate(['/login']);
    }
  }
}
