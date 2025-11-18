import { Injectable, computed, signal, inject } from '@angular/core';
import { Dress } from '../types/types.js';
import { DressService } from '../../../services/dress';
import { environment } from '../../../../environments/environments'; // << Import de environment

export type SortKey = 'relevancia' | 'precioAlquilerAsc' | 'precioAlquilerDesc' | 'nombreAsc' | 'nombreDesc';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private dressService = inject(DressService);

  // ✅ SIGNALS DE ESTADO
  private all = signal<Dress[]>([]);
  loading = signal(true);

  // ✅ FILTROS
  q = signal('');
  color = signal('');
  talla = signal('');
  categoria = signal('');
  sort = signal<SortKey>('relevancia');

  // ✅ PAGINACIÓN
  page = signal(1);
  pageSize = signal(9);

  constructor() {
    this.loadDressesFromBackend();
  }

  // ✅ CARGAR DESDE BACKEND
  private loadDressesFromBackend(): void {
    this.loading.set(true);

    this.dressService.getAll().subscribe({
      next: (backendData: any[]) => {
        const dresses: Dress[] = backendData
          .filter(d => d.status === 'available')
          .map(dress => {
            // ✅ CONVERTIR TALLAS CORRECTAMENTE
            let tallas: string[] = [];
            if (Array.isArray(dress.size)) {
              tallas = dress.size;
            } else if (dress.size) {
              tallas = [dress.size];
            } else {
              tallas = ['M'];
            }

            // ✅ CONVERTIR COLORES CORRECTAMENTE
            let colors: string[] = [];
            if (Array.isArray(dress.colors)) {
              colors = dress.colors;
            } else if (dress.color) {
              colors = [dress.color];
            }

            return {
              id: String(dress.id),
              nombre: dress.name,
              descripcion: dress.description || 'Elegancia y estilo',
              categoria: dress.category || 'quinceañera',
              talla: tallas,
              color: dress.color || 'blanco',
              colors: colors,
              // precioVenta eliminado
              precioAlquiler: Number(dress.rental_price),
              fotos: dress.imagen
                ? [`${environment.apiUrl}${dress.imagen}`]
                : ['../../../../assets/4.jpg'],
              condition: 'como-nuevo' as const,
              disponible: true,
              etiquetas: []
            };
          });

        this.all.set(dresses);
        this.loading.set(false);
        console.log('✅ Vestidos cargados en catálogo:', dresses.length);
      },
      error: (err) => {
        console.error('❌ Error al cargar vestidos:', err);
        this.loading.set(false);
        this.all.set([]);
      }
    });
  }

  // ✅ RECARGAR DATOS
  load(): void {
    this.loadDressesFromBackend();
  }

  // ✅ OBTENER TODO
  getAll(): Dress[] {
    return this.all();
  }

  // ✅ COMPUTADOS - FILTRADO
  private filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const col = this.color().trim().toLowerCase();
    const tal = this.talla().trim().toUpperCase();
    const cat = this.categoria().trim().toLowerCase();

    return this.all().filter(d => {
      // Búsqueda por texto
      if (term && !(`${d.nombre} ${d.descripcion} ${d.color} ${d.categoria}`.toLowerCase().includes(term))) {
        return false;
      }

      // Filtro por color
      if (col && d.color.toLowerCase() !== col) {
        return false;
      }

      // Filtro por talla
      if (tal && !d.talla.includes(tal)) {
        return false;
      }

      // Filtro por categoría
      if (cat && d.categoria.toLowerCase() !== cat) {
        return false;
      }

      return true;
    });
  });

  // ✅ COMPUTADOS - ORDENAMIENTO
  private sorted = computed(() => {
    const s = this.sort();
    const arr = [...this.filtered()];

    switch (s) {
      case 'precioAlquilerAsc':
        return arr.sort((a, b) => a.precioAlquiler - b.precioAlquiler);
      case 'precioAlquilerDesc':
        return arr.sort((a, b) => b.precioAlquiler - a.precioAlquiler);
      case 'nombreAsc':
        return arr.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombreDesc':
        return arr.sort((a, b) => b.nombre.localeCompare(a.nombre));
      default:
        return arr;
    }
  });

  // ✅ COMPUTADOS - PAGINACIÓN
  total = computed(() => this.sorted().length);

  paged = computed(() => {
    const p = this.page();
    const ps = this.pageSize();
    return this.sorted().slice((p - 1) * ps, (p - 1) * ps + ps);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  // ✅ ACCIONES - FILTROS
  setQuery(v: string) {
    this.page.set(1);
    this.q.set(v);
  }

  setColor(v: string) {
    this.page.set(1);
    this.color.set(v);
  }

  setTalla(v: string) {
    this.page.set(1);
    this.talla.set(v);
  }

  setCategoria(v: string) {
    this.page.set(1);
    this.categoria.set(v);
  }

  setSort(v: SortKey) {
    this.page.set(1);
    this.sort.set(v);
  }

  // ✅ ACCIONES - PAGINACIÓN
  setPage(p: number) {
    const max = this.totalPages();
    this.page.set(Math.min(Math.max(1, p), max));
  }

  // ✅ BÚSQUEDA POR ID
  byId(id: string | number): Dress | undefined {
    const key = String(id);
    return this.all().find(d => String(d.id) === key);
  }

  // ✅ PRODUCTOS RELACIONADOS
  relatedTo(id: string | number, limit = 4): Dress[] {
    const current = this.byId(id);
    if (!current) return [];

    // Busca por categoría
    const poolCat = this.all().filter(
      d => d.categoria === current.categoria && String(d.id) !== String(id)
    );

    // Si no hay por categoría, busca por color
    const pool = poolCat.length > 0
      ? poolCat
      : this.all().filter(d => d.color === current.color && String(d.id) !== String(id));

    return pool.slice(0, limit);
  }
}
