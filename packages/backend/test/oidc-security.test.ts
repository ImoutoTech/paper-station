import { describe, expect, it } from 'vitest';
import {
  OidcTransactionCodec,
  parseOidcSubject,
  safeReturnTo,
} from '../src/module/user/oidc-security';

const secret = '0123456789abcdef0123456789abcdef';

describe('OIDC security helpers', () => {
  it('accepts only positive subjects inside the current signed INT range', () => {
    expect(parseOidcSubject('1')).toBe(1);
    expect(parseOidcSubject('2147483647')).toBe(2147483647);
    expect(() => parseOidcSubject('0')).toThrow('invalid_subject');
    expect(() => parseOidcSubject('01')).toThrow('invalid_subject');
    expect(() => parseOidcSubject('-1')).toThrow('invalid_subject');
    expect(() => parseOidcSubject('2147483648')).toThrow(
      'subject_out_of_range',
    );
  });

  it('keeps only same-site relative return paths', () => {
    expect(safeReturnTo('/config?tab=1#editor')).toBe('/config?tab=1#editor');
    expect(safeReturnTo('https://example.com')).toBe('/');
    expect(safeReturnTo('//example.com')).toBe('/');
  });

  it('encrypts, authenticates, and expires OIDC transactions', () => {
    const codec = new OidcTransactionCodec(secret);
    const now = Date.now();
    const encoded = codec.encode({
      verifier: 'verifier',
      state: 'state',
      nonce: 'nonce',
      returnTo: '/site',
      issuedAt: now,
    });

    expect(codec.decode(encoded, now).returnTo).toBe('/site');
    const tampered = `${encoded.slice(0, 40)}${encoded[40] === 'A' ? 'B' : 'A'}${encoded.slice(41)}`;
    expect(() => codec.decode(tampered, now)).toThrow();
    expect(() => codec.decode(encoded, now + 301_000)).toThrow(
      'invalid_transaction',
    );
  });

  it('rejects weak transaction secrets', () => {
    expect(() => new OidcTransactionCodec('short')).toThrow(
      'SESSION_SECRET must be at least 32 bytes',
    );
  });
});
