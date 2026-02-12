yarn add express dotenv express-rate-limit firebase-admin jsonwebtoken mongoose node-cache bcryptjs cors cookie-parser validator

firebase resp

{
iss: 'https://securetoken.google.com/project-name',
aud: 'project-name',
auth_time: 1680272763,
user_id: 'pekPsrK2jQcWe1NNZuRi6Uy5m2i1',
sub: 'pekPsrK2jQcWe1NNZuRi6Uy5m2i1',
iat: 1680272763,
exp: 1680276363,
phone_number: '+919876543210',
firebase: { identities: { phone: [Array] }, sign_in_provider: 'phone' },
uid: 'pekPsrK2jQcWe1NNZuRi6Uy5m2i1',
fireBaseLogin: true
}

changes

config/preMintedNFT.json
models/bids.js
models/NFTCategories.js
models/NFTs.js
models/seedDatabase.js

routes/v1/nfts.js
routes/v1/bids.js
routes/v1/index.js

controllers/bids.js
controllers/nfts.js

utils/index.js
index.js
