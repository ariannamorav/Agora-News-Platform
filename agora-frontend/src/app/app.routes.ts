
import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { News } from './pages/news/news';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { Categories } from './pages/categories/categories';
import { Favorites } from './pages/favorites/favorites';
import { Contact } from './pages/contact/contact';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Inicio | ÁGORA'
  },
  {
    path: 'noticias',
    component: News,
    title: 'Noticias | ÁGORA'
  },
  {
    path: 'noticia/:id',
    component: ArticleDetail,
    title: 'Detalle de noticia | ÁGORA'
  },
  {
    path: 'categorias',
    component: Categories,
    title: 'Categorías | ÁGORA'
  },
  {
    path: 'favoritos',
    component: Favorites,
    title: 'Favoritos | ÁGORA'
  },
  {
    path: 'contacto',
    component: Contact,
    title: 'Contacto | ÁGORA'
  },
  {
    path: 'admin',
    component: Admin,
    title: 'Administración | ÁGORA'
  },
  {
    path: '**',
    redirectTo: ''
  }
];