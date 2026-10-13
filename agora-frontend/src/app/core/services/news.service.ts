import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';
import { News } from '../../models/news.model';
import { ImageStorageService } from './image-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly imageStorage = inject(ImageStorageService);
  private readonly newsUrl = '/data/news.json';
  private readonly storageKey = 'agora-admin-news';

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.newsUrl).pipe(
      map((originals) => {
        try {
          const stored = localStorage.getItem(this.storageKey);

          if (stored) {
            const parsed = JSON.parse(stored) as News[];

            if (Array.isArray(parsed)) {
              return parsed;
            }
          }
        } catch {
          console.error('Error al leer las noticias guardadas.');
        }

        return originals;
      }),
      switchMap(async (articles) => {
        return Promise.all(
          articles.map(async (article) => {
            const imagePath = article.image || '';

            if (!imagePath.startsWith('indexeddb:')) {
              return article;
            }

            const id = Number(imagePath.replace('indexeddb:', ''));

            if (!Number.isInteger(id) || id <= 0) {
              return { ...article, image: '' };
            }

            try {
              const image = await this.imageStorage.getImage(id);

              if (!image) {
                return { ...article, image: '' };
              }

              return {
                ...article,
                image: URL.createObjectURL(image)
              };
            } catch {
              return { ...article, image: '' };
            }
          })
        );
      })
    );
  }

  getNewsById(id: number): Observable<News | undefined> {
    return this.getNews().pipe(
      map((articles) => articles.find((article) => article.id === id))
    );
  }

  getCategories(): Observable<string[]> {
    return this.getNews().pipe(
      map((articles) => [
        ...new Set(articles.map((article) => article.category))
      ])
    );
  }
}
