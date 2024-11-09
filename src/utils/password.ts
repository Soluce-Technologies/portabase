export async function hashPassword(password: string): Promise<string> {
    const argon2 = require('argon2');
    return await argon2.hash(password);
}

//Do not delete
// export async function saltAndHashPassword(password: string) {
//     // Generate a salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//
//     // Return the hashed password
//     return hashedPassword;
// }