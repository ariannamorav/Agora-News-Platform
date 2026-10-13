import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News as NewsArticle } from '../../models/news.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private readonly newsService = inject(NewsService);

  favoriteNews: NewsArticle[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.loading = true;

    this.newsService.getNews().subscribe({
      next: (news) => {
        try {
          const stored = JSON.parse(
            localStorage.getItem('agora-favorites') ?? '[]'
          );

          const ids: number[] = Array.isArray(stored)
            ? stored.filter(
                (id): id is number => typeof id === 'number'
              )
            : [];

          this.favoriteNews = news.filter((item) =>
            ids.includes(item.id)
          );

          this.errorMessage = '';
        } catch {
          this.favoriteNews = [];
          this.errorMessage =
            'No fue posible leer tus favoritos guardados.';
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las noticias.';
        this.loading = false;
      }
    });
  }

  getImageUrl(image: string): string {
    if (!image) {
      return '';
    }

    if (
      image.startsWith('blob:') ||
      image.startsWith('data:') ||
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {
      return image;
    }

    if (image.startsWith('indexeddb:')) {
      return '';
    }

    return '/' + image.replace(/^\/+/, '');
  }

  removeFavorite(id: number): void {
    try {
      const stored = JSON.parse(
        localStorage.getItem('agora-favorites') ?? '[]'
      );

      const ids: number[] = Array.isArray(stored)
        ? stored.filter(
            (favoriteId): favoriteId is number =>
              typeof favoriteId === 'number'
          )
        : [];

      const updated = ids.filter((favoriteId) => favoriteId !== id);

      localStorage.setItem('agora-favorites', JSON.stringify(updated));

      this.favoriteNews = this.favoriteNews.filter(
        (item) => item.id !== id
      );
    } catch {
      this.errorMessage =
        'No fue posible eliminar el favorito.';
    }
  }
}