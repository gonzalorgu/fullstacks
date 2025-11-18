import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // ✅ EXCEPCIONES - URLs que NO necesitan JWT
  const exceptUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password'
  ];

  const shouldExclude = exceptUrls.some(url => req.url.includes(url));

  console.log('🔍 Interceptor - URL:', req.url);
  console.log('🔍 ¿Excluida?:', shouldExclude);

  // ✅ Si es una excepción, pasar sin modificar
  if (shouldExclude) {
    console.log('⏭️ Saltando JWT para:', req.url);
    return next(req);
  }

  // ✅ Para todas las demás, agregar JWT
  const token = authService.getToken();

  console.log('🔍 Token en interceptor:', token ? '✅ EXISTE' : '❌ NO EXISTE');

  if (token && req.url.includes('localhost:3000')) {
    console.log('✅ Agregando JWT al header');

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  return next(req);
};
