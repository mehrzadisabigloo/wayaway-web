import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
// import { CredentialsService } from 'src/app/auth/credentials.service';
import { CredentialsService } from '../../../auth/credentials.service';
import { environment } from '../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // Add server URL prefix if the URL doesn't start with http or https
  if (!/^(http|https):/i.test(req.url)) {
    req = req.clone({ url: environment.serverUrl + req.url });
  }

  // Securely inject the CredentialsService
  const credentialsService = inject(CredentialsService);
  const auth = credentialsService?.credentials;
  // Add the Authorization header only if the token is present
  if (auth?.token) {
    req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${auth.token}`) });
  }

  return next(req);
};

