import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News as NewsArticle } from '../../models/news.model';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css',
})
export class ArticleDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly newsService = inject(NewsService);

  article: NewsArticle | undefined;
  loading = true;
  errorMessage = '';
  isFavorite = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.loading = false;
      this.errorMessage = 'El identificador de la noticia no es válido.';
      return;
    }

    this.newsService.getNewsById(id).subscribe({
      next: (news) => {
        this.article = news;
        this.loading = false;

        if (!news) {
          this.errorMessage = 'No se encontró la noticia solicitada.';
          return;
        }

        this.checkFavorite();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar la noticia.';
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

  private checkFavorite(): void {
    if (!this.article) {
      return;
    }

    try {
      const stored = JSON.parse(
        localStorage.getItem('agora-favorites') ?? '[]'
      );

      const favorites: number[] = Array.isArray(stored) ? stored : [];

      this.isFavorite = favorites.includes(this.article.id);
    } catch {
      this.isFavorite = false;
    }
  }

  toggleFavorite(): void {
    if (!this.article) {
      return;
    }

    try {
      const stored = JSON.parse(
        localStorage.getItem('agora-favorites') ?? '[]'
      );

      const favorites: number[] = Array.isArray(stored) ? stored : [];
      const id = this.article.id;

      const updated = favorites.includes(id)
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id];

      localStorage.setItem('agora-favorites', JSON.stringify(updated));
      this.isFavorite = updated.includes(id);
    } catch {
      this.errorMessage =
        'No fue posible guardar el favorito en este navegador.';
    }
  }
}