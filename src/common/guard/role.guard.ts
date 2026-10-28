import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorator/auth.decorator.ts';
import { AuthUser } from '../../modules/auth/jwt.strategy.ts';

@Injectable()
class RoleGurad implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    let requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
    const user = context.switchToHttp().getRequest().user as AuthUser;
    const hasRole = Array.isArray(user.role) ? user.role : [user.role];
    return hasRole.some((role) => requiredRoles.includes(role));
  }
}

export default RoleGurad;
