const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKey = process.env.PRIVATE_KEY || fs.readFileSync('./data/private.key', 'utf8');
const publicKey = process.env.PUBLIC_KEY || fs.readFileSync('./data/public.key', 'utf8');

const signOptions = {
  issuer: 'Byteslicer',
  subject: 'admin@byteslicer.de',
  audience: 'http://byteslice.de',
  expiresIn: '7d',
  algorithm: 'RS256',
};

module.exports = {
  sign: payload => jwt.sign(payload, privateKey, signOptions),
  verify: (token) => {
    try {
      return jwt.verify(token, publicKey, signOptions);
    } catch (err) {
      return false;
    }
  },
  decode: token => jwt.decode(token, { complete: true }),
};
