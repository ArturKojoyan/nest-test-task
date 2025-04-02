import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { PermissionLevel, User } from 'src/schemas/user.schema';

export type CustomRequest = Request & {
  user: User;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<PermissionLevel[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request: CustomRequest = context.switchToHttp().getRequest();
    const { user } = request;
    console.log('🚀 ~ RolesGuard ~ canActivate ~ user:', user);

    if (!user || !user.permissions) {
      return false; // deny access if user or permission is missing
    }

    // extract companyId from request params
    const companyId = request.params?.companyId;
    console.log('🚀 ~ RolesGuard ~ canActivate ~ companyId:', companyId);
    if (!companyId) {
      return false; // Deny access if companyId is missing
    }

    // get the user's permissions for the specific company
    const userPermissions = user.permissions[companyId];
    if (!userPermissions || userPermissions.length === 0) {
      return false;
    }

    console.log(requiredRoles, 'requiredRoles');
    console.log(userPermissions, 'userPermissions');
    // check if the user has at least one of the required roles
    const hasRole = requiredRoles.some((role) =>
      userPermissions.includes(role),
    );
    return hasRole;
  }
}
