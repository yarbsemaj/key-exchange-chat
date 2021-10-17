# Secure Web Chat

###### An implementation of an (RSA)[https://en.wikipedia.org/wiki/RSA_(cryptosystem)] signed (diffy helman)[https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange] 

![Image of Secure Web Chat](https://user-images.githubusercontent.com/17494632/137641389-51add67c-ab20-49f0-a04b-4ca2af7d0d64.png)

## Setup Server
 1. `cd server`
 2. `npm install`
 3. `sls deploy`
## Setup Client
 1. `cp .env.example .env`
 2. Set `WEB_SOCKET_URL` and update `G` and `N` if you wish.
 3. `npm install`
 4. `npm run dev`