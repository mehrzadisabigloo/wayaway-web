export interface RouteSeoData {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
}

export interface RouteWithSeo {
  path: string;
  component: any;
  seo?: RouteSeoData;
  children?: RouteWithSeo[];
  canActivate?: any[];
  data?: any;
} 