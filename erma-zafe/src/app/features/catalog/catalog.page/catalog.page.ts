import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DressCard } from '../dress-card/dress-card';
import { CatalogStore } from '../catalog.store/catalog.store';

@Component({
  selector: 'app-catalog.page',
  imports: [CommonModule, FormsModule, DressCard],
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ MEJORA: Solo detecta cambios en inputs
})
export class CatalogPage implements OnInit {
  store = inject(CatalogStore);

  // ✅ LOADING STATE
  isLoading = signal(true);

  // ✅ PAGINACIÓN
  currentPage = signal(1);
  pageSize = 12; // 12 vestidos por página

  // ✅ DATOS PAGINADOS
  allDresses = computed(() => this.store.getAll());

  paginatedDresses = computed(() => {
    const all = this.allDresses();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  // ✅ INFO DE PAGINACIÓN
  totalPages = computed(() =>
    Math.ceil(this.allDresses().length / this.pageSize)
  );

  currentPageDresses = computed(() => this.paginatedDresses());

  ngOnInit() {
    // ✅ Simula carga con 300ms de delay para mostrar skeleton
    this.isLoading.set(true);

    // Carga datos del store
    this.store.load();

    // Simula que tardó un poco (en producción, suscribirse al store)
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  // ✅ MÉTODOS DE PAGINACIÓN
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
