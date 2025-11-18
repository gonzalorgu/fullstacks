import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DressService } from '../../../services/dress';
import { environment } from '../../../../environments/environments';

interface FeaturedDress {
  id: number;
  nombre: string;
  descripcion: string;
  precioAlquiler: number;
  imagen: string;
}

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './featured.html',
  styleUrl: './featured.scss'
})
export class Featured implements OnInit {
  private dressService = inject(DressService);

  vestidos = signal<FeaturedDress[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadFeaturedDresses();
  }

  loadFeaturedDresses(): void {
    this.loading.set(true);

    this.dressService.getAll().subscribe({
      next: (data: any[]) => {
        // Ordenar por fecha creada, estado disponible y tomar primeros 8
        const featured = data
          .filter(d => d.status === 'available')
          .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 8)
          .map(dress => ({
            id: dress.id,
            nombre: dress.name,
            descripcion: dress.description || 'Elegancia y estilo',
            precioAlquiler: Number(dress.rental_price),
           imagen: dress.imagen ? `${environment.apiUrl}${dress.imagen}` : 'assets/4.jpg'
          }));

        this.vestidos.set(featured);
        this.loading.set(false);
        console.log('✅ Vestidos de estreno cargados:', featured);
      },
      error: (err) => {
        console.error('❌ Error al cargar estrenos:', err);
        this.loading.set(false);
      }
    });
  }
}
