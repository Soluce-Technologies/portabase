from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"


class Permission(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"


role_permissions = {
    Role.ADMIN: [Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE],
    Role.MODERATOR: [Permission.CREATE, Permission.READ, Permission.UPDATE],
    Role.USER: [Permission.READ]
}
