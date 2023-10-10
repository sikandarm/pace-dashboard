import PERMISSIONS from './permissionsConfig';

const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};

const hasNavPermission = (userPermissions, requiredPermissions) => {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

export { hasPermission, hasNavPermission, PERMISSIONS };
