import crypto from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const cipherText = (value) =>
    encodeURIComponent(
        crypto.AES.encrypt(
            JSON.stringify(value),
            process.env.REACT_APP_PASSPHRASE || '',
        ).toString(),
    );

export const decipherText = (encryptedText) => {
    try {
        const bytes = crypto.AES.decrypt(
            decodeURIComponent(encryptedText),
            process.env.REACT_APP_PASSPHRASE || '',
        );
        const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
        return decryptedData;
    } catch (error) {
        throw new Error(error);
    }
};
