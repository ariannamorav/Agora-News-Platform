
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News as NewsArticle } from '../../models/news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './news.html',
  styleUrl: './news.css'
})
export class News implements OnInit {
  private readonly newsService = inject(NewsService);

  news: NewsArticle[] = [];
  categories: string[] = [];
  selectedCategory = 'Todos';
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.news = data;
        this.categories = [
          ...new Set(data.map((item) => item.category))
        ];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las noticias.';
        this.loading = false;
      }
    });
  }

  get filteredNews(): NewsArticle[] {
    if (this.selectedCategory === 'Todos') {
      return this.news;
    }

    return this.news.filter(
      (item) => item.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
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
}
