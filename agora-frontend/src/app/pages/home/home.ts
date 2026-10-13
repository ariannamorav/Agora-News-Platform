import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News } from '../../models/news.model';

@Component({
selector: 'app-home',
standalone: true,
imports: [RouterLink],
templateUrl: './home.html',
styleUrl: './home.css'
})
export class Home implements OnInit {
private readonly newsService = inject(NewsService);

news: News[] = [];
loading = true;
errorMessage = '';

ngOnInit(): void {
this.newsService.getNews().subscribe({
next: (data) => {
this.news = data;
this.loading = false;
},
error: () => {
this.errorMessage =
'No fue posible cargar las noticias. Inténtalo de nuevo más tarde.';
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
}