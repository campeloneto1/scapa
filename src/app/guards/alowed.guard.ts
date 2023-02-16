import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../sistema/shared/session.service';

@Injectable({
  providedIn: 'root'
})
export class AlowedGuard implements CanActivate {

  constructor(private sessionService: SessionService,
    private route: Router){}

  

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

     
    return this.sessionService.hasPermission(next);
  }
  
}
