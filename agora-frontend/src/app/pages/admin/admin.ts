import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { NewsService } from '../../core/services/news.service';
import { ImageStorageService } from '../../core/services/image-storage.service';
import { News as NewsArticle } from '../../models/news.model';

type ArticleFormData = Omit<NewsArticle, 'id'>;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, OnDestroy {
  private readonly newsService = inject(NewsService);
  private readonly imageStorage = inject(ImageStorageService);

  @ViewChild('formSection')
  private formSection?: ElementRef<HTMLElement>;

  articles: NewsArticle[] = [];
  imageUrls: Record<number, string> = {};

  showForm = false;
  editingId: number | null = null;
  noticeMessage = '';
  formError = '';
  selectedImage: File | null = null;
  imagePreview = '';
  saving = false;

  private previewUrl = '';

  formData: ArticleFormData = this.emptyForm();

  ngOnInit(): void {
    this.loadArticles();
  }

  ngOnDestroy(): void {
    this.releasePreviewUrl();

    for (const url of Object.values(this.imageUrls)) {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
  }

  private emptyForm(): ArticleFormData {
    return {
      title: '',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      author: '',
      image: '',
      excerpt: '',
      content: ''
    };
  }

  private scrollToForm(): void {
    setTimeout(() => {
      this.formSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 0);
  }

  private releasePreviewUrl(): void {
    if (this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = '';
  }

  private loadArticles(): void {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.articles = this.getStoredArticles(data);
        void this.refreshImageUrls();
      },
      error: () => {
        this.noticeMessage =
          'No fue posible cargar las noticias originales.';

        this.articles = this.getStoredArticles([]);
        void this.refreshImageUrls();
      }
    });
  }

  private getStoredArticles(
    originals: NewsArticle[]
  ): NewsArticle[] {
    try {
      const stored = localStorage.getItem('agora-admin-news');

      if (stored === null) {
        return originals;
      }

      const parsed: unknown = JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed as NewsArticle[]
        : originals;
    } catch {
      this.noticeMessage =
        'No se pudieron leer los cambios guardados. Se mostrarán las noticias originales.';

      return originals;
    }
  }

  private persistArticles(): boolean {
    try {
      localStorage.setItem(
        'agora-admin-news',
        JSON.stringify(this.articles)
      );

      return true;
    } catch {
      this.formError =
        'No fue posible guardar la noticia. Comprueba el espacio disponible.';

      return false;
    }
  }

  private async refreshImageUrls(): Promise<void> {
    const urls: Record<number, string> = {};

    for (const article of this.articles) {
      urls[article.id] = await this.resolveImage(article);
    }

    for (const oldUrl of Object.values(this.imageUrls)) {
      if (oldUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldUrl);
      }
    }

    this.imageUrls = urls;
  }

  private async resolveImage(
    article: NewsArticle
  ): Promise<string> {
    if (article.image.startsWith('indexeddb:')) {
      const id = Number(
        article.image.substring('indexeddb:'.length)
      );

      try {
        const blob = await this.imageStorage.getImage(id);
        return blob ? URL.createObjectURL(blob) : '';
      } catch {
        return '';
      }
    }

    return article.image
      ? `/${article.image.replace(/^\/+/, '')}`
      : '';
  }

  newArticle(): void {
    this.releasePreviewUrl();

    this.editingId = null;
    this.formData = this.emptyForm();
    this.selectedImage = null;
    this.imagePreview = '';
    this.formError = '';
    this.noticeMessage = '';
    this.showForm = true;

    this.scrollToForm();
  }

  async editArticle(article: NewsArticle): Promise<void> {
    this.releasePreviewUrl();

    this.editingId = article.id;

    this.formData = {
      title: article.title,
      category: article.category,
      date: this.normalizeDate(article.date),
      author: article.author,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content
    };

    this.selectedImage = null;
    this.imagePreview = '';
    this.formError = '';
    this.noticeMessage = '';
    this.showForm = true;

    this.scrollToForm();

    this.imagePreview = await this.resolveImage(article);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.formError = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError =
        'Selecciona un archivo de imagen válido.';

      input.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.formError =
        'La imagen no puede superar los 5 MB.';

      input.value = '';
      return;
    }

    this.releasePreviewUrl();

    this.selectedImage = file;
    this.previewUrl = URL.createObjectURL(file);
    this.imagePreview = this.previewUrl;
    this.formData.image = 'imagen-pendiente';
  }

  cancelForm(): void {
    this.releasePreviewUrl();

    this.showForm = false;
    this.editingId = null;
    this.formData = this.emptyForm();
    this.selectedImage = null;
    this.imagePreview = '';
    this.formError = '';
    this.saving = false;
  }

  async saveArticle(form: NgForm): Promise<void> {
    this.formError = '';
    this.noticeMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();

      this.formError =
        'Completa correctamente todos los campos obligatorios.';

      return;
    }

    if (!this.selectedImage && !this.formData.image) {
      this.formError =
        'Selecciona una imagen para la noticia.';

      return;
    }

    const cleaned: ArticleFormData = {
      title: this.formData.title.trim(),
      category: this.formData.category.trim(),
      date: this.formData.date,
      author: this.formData.author.trim(),
      image: this.formData.image.trim().replace(/^\/+/, ''),
      excerpt: this.formData.excerpt.trim(),
      content: this.formData.content.trim()
    };

    if (
      cleaned.title.length < 5 ||
      cleaned.category.length === 0 ||
      cleaned.author.length < 2 ||
      cleaned.excerpt.length < 10 ||
      cleaned.content.length < 20
    ) {
      this.formError =
        'Revisa los campos: hay datos incompletos.';

      return;
    }

    this.saving = true;

    try {
      const articleId = this.editingId ??
        Math.max(
          0,
          ...this.articles.map((article) => article.id)
        ) + 1;

      if (this.selectedImage) {
        await this.imageStorage.saveImage(
          articleId,
          this.selectedImage
        );

        cleaned.image = `indexeddb:${articleId}`;
      }

      const savedArticle: NewsArticle = {
        id: articleId,
        ...cleaned
      };

      const previousArticles = this.articles;

      if (this.editingId !== null) {
        this.articles = this.articles.map((article) =>
          article.id === articleId
            ? savedArticle
            : article
        );
      } else {
        this.articles = [...this.articles, savedArticle];
      }

      if (!this.persistArticles()) {
        this.articles = previousArticles;
        return;
      }

      this.noticeMessage = this.editingId !== null
        ? 'La noticia se actualizó correctamente.'
        : 'La noticia se creó correctamente.';

      await this.refreshImageUrls();
      this.cancelForm();
    } catch {
      this.formError =
        'No fue posible guardar la noticia o su imagen en este navegador.';
    } finally {
      this.saving = false;
    }
  }

  async deleteArticle(id: number): Promise<void> {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta noticia de la lista administrada?'
    );

    if (!confirmed) {
      return;
    }

    const article = this.articles.find(
      (item) => item.id === id
    );

    const previousArticles = this.articles;

    this.articles = this.articles.filter(
      (item) => item.id !== id
    );

    if (!this.persistArticles()) {
      this.articles = previousArticles;
      return;
    }

    if (article?.image.startsWith('indexeddb:')) {
      try {
        await this.imageStorage.deleteImage(id);
      } catch {
        this.noticeMessage =
          'La noticia se eliminó, pero no se pudo borrar su archivo de imagen.';
      }
    }

    if (this.imageUrls[id]?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imageUrls[id]);
    }

    delete this.imageUrls[id];

    if (this.editingId === id) {
      this.cancelForm();
    }

    if (!this.noticeMessage) {
      this.noticeMessage =
        'La noticia se eliminó correctamente.';
    }
  }

  private normalizeDate(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString().slice(0, 10)
      : parsed.toISOString().slice(0, 10);
  }
}
