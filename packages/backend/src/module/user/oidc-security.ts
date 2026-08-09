import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { OIDC_TRANSACTION_MAX_AGE_SECONDS } from './user.constants';

export interface OidcTransaction {
  verifier: string;
  state: string;
  nonce: string;
  returnTo: string;
  issuedAt: number;
}

export const parseOidcSubject = (subject?: string) => {
  if (!subject || !/^[1-9]\d*$/.test(subject)) {
    throw new Error('invalid_subject');
  }
  const value = BigInt(subject);
  if (value > 2147483647n) throw new Error('subject_out_of_range');
  return Number(value);
};

export const safeReturnTo = (returnTo?: string) => {
  if (!returnTo?.startsWith('/') || returnTo.startsWith('//')) return '/';
  try {
    const parsed = new URL(returnTo, 'https://paper-station.local');
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
};

export class OidcTransactionCodec {
  private readonly key: Buffer;

  constructor(secret: string) {
    if (Buffer.byteLength(secret || '', 'utf8') < 32) {
      throw new Error('SESSION_SECRET must be at least 32 bytes');
    }
    this.key = createHash('sha256').update(secret).digest();
  }

  encode(transaction: OidcTransaction) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(transaction), 'utf8'),
      cipher.final(),
    ]);
    return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString(
      'base64url',
    );
  }

  decode(value: string, now = Date.now()): OidcTransaction {
    const packed = Buffer.from(value, 'base64url');
    if (packed.length < 29) throw new Error('invalid_transaction');
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      packed.subarray(0, 12),
    );
    decipher.setAuthTag(packed.subarray(12, 28));
    const transaction = JSON.parse(
      Buffer.concat([
        decipher.update(packed.subarray(28)),
        decipher.final(),
      ]).toString('utf8'),
    ) as OidcTransaction;

    if (
      !transaction.verifier ||
      !transaction.state ||
      !transaction.nonce ||
      !Number.isFinite(transaction.issuedAt) ||
      transaction.issuedAt > now + 30_000 ||
      now - transaction.issuedAt > OIDC_TRANSACTION_MAX_AGE_SECONDS * 1000
    ) {
      throw new Error('invalid_transaction');
    }
    transaction.returnTo = safeReturnTo(transaction.returnTo);
    return transaction;
  }
}
