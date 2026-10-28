import {
  createParamDecorator,
  SetMetadata,
  ExecutionContext,
  applyDecorators,
} from '@nestjs/common';
import { AuthUser } from '../../modules/auth/jwt.strategy.ts';

/**
 * 公共接口装饰器元数据键
 */
export const IS_PUBLIC_KEY = Symbol('isPublic');

/**
 * 公共接口装饰器
 * @param data 是否为公共接口
 */
export const Public = (data: boolean = true) =>
  SetMetadata(IS_PUBLIC_KEY, data);

/**
 * 当前用户装饰器
 * @returns 当前用户信息
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);

/**
 *  权限装饰器元数据键
 */
export const ROLE_KEY = Symbol('role');

/**
 * 角色装饰器
 * @param data 角色列表
 */
export const Role = (data: number[] | number) =>
  applyDecorators(
    SetMetadata(ROLE_KEY, data),
    SetMetadata(IS_PUBLIC_KEY, false),
  );
