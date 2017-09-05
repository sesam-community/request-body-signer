body-signing-proxy
==================

Signs the hash of the request body as a JWT.

Required properties:
* SIGNING_KEY - key used to sign the JWT - required
* JWT_ISSUER - issuer (iss) prop to put in the jwt

Additional properties:
* HASH_ALGORITM - algoritm used to hash the body, defaults to sha256
* JWT_EXPIRY - how long the jwt should be valid (in seconds since now) exp prop in the jwt, defaults to 5 minutes
* TARGET - where to route the requests next, defaults to requested url
