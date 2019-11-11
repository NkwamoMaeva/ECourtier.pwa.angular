import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../@services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionGuard implements CanActivate {

  constructor(private route: Router, private storage: StorageService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.storage.set('uploadFile_PreviousUrl', state.url);
    if (next.params.type != 'bordereau' && next.params.type != 'commission') {
      this.route.navigate(['/not-found'], { queryParams: { returnUrl: state.url } });
      return false;
    } else {
      return true;
    }
  }
}
