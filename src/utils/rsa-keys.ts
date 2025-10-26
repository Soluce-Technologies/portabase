import {promises as fs} from 'fs';
import path from 'path';
import {generateKeyPair} from 'crypto';
import {promisify} from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

/**
 * Generate RSA keypair into a directory (default: ./private).
 * - Skips generation if both files already exist.
 * - Private key mode 0o600. Public key mode 0o644.
 * @param {string} [dir] path to directory
 * @returns {Promise<{privateKeyPath:string, publicKeyPath:string}>}
 */
export async function generateRSAKeys(dir = path.join(process.cwd(), 'private/keys')) {
    await fs.mkdir(dir, {recursive: true});

    const privateKeyPath = path.join(dir, 'server_private.pem');
    const publicKeyPath = path.join(dir, 'server_public.pem');

    try {
        await fs.access(privateKeyPath);
        await fs.access(publicKeyPath);
        console.log('RSA keys already exist. Skipping generation.');
        return {privateKeyPath, publicKeyPath};
    } catch {
    }

    const {publicKey, privateKey} = await generateKeyPairAsync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {type: 'pkcs1', format: 'pem'},
        privateKeyEncoding: {type: 'pkcs1', format: 'pem'},
    });

    await fs.writeFile(privateKeyPath, privateKey, {mode: 0o600});
    await fs.writeFile(publicKeyPath, publicKey, {mode: 0o644});

    return {privateKeyPath, publicKeyPath};
}
