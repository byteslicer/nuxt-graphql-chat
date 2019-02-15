const crypto = require('crypto');

export default {
  hash(secret, salt) {
    return new Promise((res, rej) => crypto.pbkdf2(
      secret,
      salt,
      100000,
      64,
      'sha512',
      (err, derivedKey) => (err && rej(err)) || res(derivedKey.toString('hex')),
    ));
  },
  salt() {
    return crypto.randomBytes(32).toString('hex');
  },
};
