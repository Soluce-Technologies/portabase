

export async function hashPassword(password: string): Promise<string> {
    const argon2 = require('argon2');

    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}
