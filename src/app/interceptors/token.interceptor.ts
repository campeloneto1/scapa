import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../sistema/shared/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log('aaaaaaaaaaaaa');
    if (this.sessionService.check()) {
      //console.log('bbbbbbbbbbbbb');
      //const token = this.sessionService.retornaToken();
      var temp = localStorage.getItem('token')?.length;
     //@ts-ignore
     const token = atob(localStorage.getItem('token').substr(0, temp - 7));

     const skipIntercept = request.headers.has('skip');
     //console.log(skipIntercept)
     if (skipIntercept) {
        request = request.clone();
      }else{
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            // Website you wish to allow to connect
          }
          
        });
      }
    }

    return next.handle(request).pipe(
      tap(event => {
        
          }, 
          error => {
            if(error.status == 401){
              this.router.navigate(['auth']);
              localStorage.clear();
            }
          })
    );
  }
}
