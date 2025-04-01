import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { User } from 'src/schemas/user.schema';

export type CustomRequest = Request & {
  user: User;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request: CustomRequest = context.switchToHttp().getRequest();
    const { user } = request;
    console.log('🚀 ~ RolesGuard ~ canActivate ~ user:', user);

    if (!user || !user.permission) {
      return false; // deny access if user or permission is missing
    }

    return requiredRoles.includes(user.permission); // check user's permission
  }
}
