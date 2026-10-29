import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../../modules/auth/jwt.strategy.ts';
import { ROLE_KEY } from '../decorator/auth.decorator.ts';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = req.user;

    if (!user) return false;

    const userRoles = Array.isArray(user.role)
      ? user.role
      : user.role
        ? [user.role]
        : [];

    return userRoles.some((role) => requiredRoles.includes(role));
  }
}
