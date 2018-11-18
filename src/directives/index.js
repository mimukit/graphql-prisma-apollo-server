const {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

class IsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.resolve = async (result, args, ctx, info) => {
      if (!ctx.user.id) {
        throw new AuthenticationError('You must login to perform this action');
      }
      return result[field.name];
    };
  }
}

class HasRoleDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.role;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.role;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];

      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (...args) => {
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const ctx = args[2];

        if (!ctx.user.roles.includes(requiredRole)) {
          throw new ForbiddenError(
            "You don't have permission to perform this action",
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = {
  IsAuthDirective,
  HasRoleDirective,
};
