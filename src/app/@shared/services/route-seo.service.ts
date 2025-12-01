import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { RouteSeoData } from '../interfaces/route-seo.interface';
/**
  * use in routes
  * 
  *     {
  *      path: 'page/:slug',
  *     component: PageViewComponent,
  *      data: {
  *        seo: {
  *          title: 'صفحه |  یچیزی',
  *          description: 'مشاهده صفحه در  یچیزی.',
  *          keywords: 'صفحه,  یچیزی',
  *        } as RouteSeoData,
  *      },
  *    },
  * 
  *    setHomePageMeta  , defaultSeoConfig  هم در این کامپوننت پر شود 
*/
@Injectable({
  providedIn: 'root',
})
export class RouteSeoService {
  
  private defaultSeoConfig: RouteSeoData = {
    title: 'عنوان پیش‌فرض پروژه',
    description: 'توضیحات پیش‌فرض پروژه',
    keywords: '',
    image: '',
    url: '',
    type: 'website',
  };

  setHomePageMeta() {
    this.setMetaTags({
      title: 'عنوان پیش‌فرض پروژه',
      description: 'توضیحات پیش‌فرض پروژه',
      keywords: '',
    });
  }


  constructor(private router: Router, private meta: Meta, private title: Title) {
    this.initializeRouteSeo();
  }

  // تنظیم پیش‌فرض‌ها از بیرون
  setDefaultSeo(config: Partial<RouteSeoData>) {
    this.defaultSeoConfig = { ...this.defaultSeoConfig, ...config };
  }

  private initializeRouteSeo() {
    // گوش دادن به تغییرات route
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateSeoFromRoute();
    });
  }

  private updateSeoFromRoute() {
    // پیدا کردن route فعال
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    // دریافت SEO data از route
    const seoData = route.snapshot.data['seo'] as RouteSeoData;

    if (seoData) {
      console.log('🔄 Updating SEO from route:', seoData.title);
      this.setMetaTags(seoData);
    } else {
      console.log('⚠️ No SEO data found for route:', route.snapshot.url);
      this.setHomePageMeta();
    }
  }

  setMetaTags(config: RouteSeoData) {
    const finalConfig = { ...this.defaultSeoConfig, ...config };

    try {
      // تنظیم عنوان صفحه
      this.title.setTitle(finalConfig.title);

      // متا تگ‌های اصلی
      this.meta.updateTag({ name: 'title', content: finalConfig.title });
      this.meta.updateTag({ name: 'description', content: finalConfig.description });
      this.meta.updateTag({ name: 'keywords', content: finalConfig.keywords });

      // Open Graph متا تگ‌ها
      this.meta.updateTag({ property: 'og:title', content: finalConfig.title });
      this.meta.updateTag({ property: 'og:description', content: finalConfig.description });
      this.meta.updateTag({ property: 'og:image', content: finalConfig.image || '' });
      this.meta.updateTag({ property: 'og:url', content: finalConfig.url || '' });
      this.meta.updateTag({ property: 'og:type', content: finalConfig.type || 'website' });
      // Twitter متا تگ‌ها
      this.meta.updateTag({ name: 'twitter:title', content: finalConfig.title });
      this.meta.updateTag({ name: 'twitter:description', content: finalConfig.description });

      this.meta.updateTag({ name: 'twitter:image', content: finalConfig.image || '' });
      this.meta.updateTag({ name: 'twitter:url', content: finalConfig.url || '' });

      // لاگ برای تست
      console.log('✅ SEO Meta Tags Updated:', {
        title: finalConfig.title,
        description: finalConfig.description,
        keywords: finalConfig.keywords,
      });
    } catch (error) {
      console.error('❌ Error updating SEO meta tags:', error);
    }
  }

  // تنظیم متا تگ‌های صفحه اصلی

  clearMetaTags() {
    this.meta.removeTag('name="title"');
    this.meta.removeTag('name="description"');
    this.meta.removeTag('name="keywords"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
    this.meta.removeTag('name="twitter:url"');
  }

  updateSeo(seoData: RouteSeoData) {
    this.setMetaTags(seoData);
  }

  getCurrentRouteSeo(): RouteSeoData | null {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    return (route.snapshot.data['seo'] as RouteSeoData) || null;
  }

  getCurrentMetaStatus() {
    const currentTitle = this.title.getTitle();
    const currentDescription = this.meta.getTag('name="description"')?.content;
    const currentKeywords = this.meta.getTag('name="keywords"')?.content;

    return {
      title: currentTitle,
      description: currentDescription,
      keywords: currentKeywords,
      timestamp: new Date().toISOString(),
    };
  }
}
