export const verify =
  (requiredPermissions, checkAll = true) =>
  (req, res, next) => {
    if (!Array.isArray(requiredPermissions)) {
      requiredPermissions = [requiredPermissions];
    }
    let authorized;
    const permissions = req.user.user.permissions;

    if (permissions.length > 0) {
      const newArrayPermission = [];

      permissions.map((per) => newArrayPermission.push(per.permission));

      if (checkAll) {
        authorized = requiredPermissions.every((permission) => newArrayPermission.includes(permission));
      } else {
        authorized = requiredPermissions.some((permission) => newArrayPermission.includes(permission));
      }

      authorized ? next() : res.status(403).json({ message: 'User does not have permission to run this feature.' });
    } else {
      res.status(403).json({ message: 'User does not have permission to run this feature.' });
    }
  };
