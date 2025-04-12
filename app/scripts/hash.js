const crypto = require('crypto');

const secretKey = process.env.HASH_SECRET;

const hashHex = (hex) => {
  console.log("Hex:", hex, secretKey)
  const buffer = Buffer.from(hex, 'hex')
  console.log("Buffer:", buffer)
  
  // Create HMAC with sha256 and the secret key
  const hmac = crypto.createHmac('sha256', secretKey)
                     .update(buffer)
                     .digest('hex')
  return hmac
}

module.exports = {
  hashHex
}