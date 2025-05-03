import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer fake-token`
      }
    });
    return next(modifiedReq);
  };