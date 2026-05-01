import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';


/**
 * Guard que permite acceso solo a usuarios con rol administrador.
 *
 * @returns Observable<boolean | UrlTree>
 */
export const adminGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.isAdmin$.pipe(
    map((isAdmin: boolean) => {
      if (isAdmin) {
        return true;
      }

      // Redirige a inicio si no es admin
      return router.createUrlTree(['/']);
    })
  );
};