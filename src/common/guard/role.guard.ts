import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../../modules/auth/jwt.strategy.ts';
import { ROLE_KEY } from '../decorator/auth.decorator.ts';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    requiredRoles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    const req = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = req.user;

    if (!user) return false;

    const userRoles = Array.isArray(user.role)
      ? user.role
      : user.role
        ? [user.role]
        : [];
    console.debug(userRoles);
    console.debug(requiredRoles);
    return userRoles.some((role) => requiredRoles.includes(role));
  }
}
