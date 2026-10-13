import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News as NewsArticle } from '../../models/news.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private readonly newsService = inject(NewsService);

  news: NewsArticle[] = [];
  categories: string[] = [];
  selectedCategory = 'Todas';
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
        this.errorMessage = 'No fue posible cargar las categorías.';
        this.loading = false;
      }
    });
  }

  get filteredNews(): NewsArticle[] {
    if (this.selectedCategory === 'Todas') {
      return this.news;
    }

    return this.news.filter(
      (item) => item.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  countNews(category: string): number {
    return this.news.filter(
      (item) => item.category === category
    ).length;
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