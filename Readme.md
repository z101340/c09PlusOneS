# PROJECT NAME
Tetris 101

# Team Members
- Zhongyang Xia
- Chengrong Zhang
- Xuan (Jack) Wei
# Live demo
A Live demo is available HERE: [https://tetris.mechanus.io](https://tetris.mechanus.io).
HAVE A LOOK!!! PLAY WITH YOUR FRIEND! NOW!

VIDEO PRESENTATION: [CLICK HERE](https://www.youtube.com/watch?v=rCHrbzPM170&feature=youtu.be)
# Description of the web application:
A port of Nintendo’s Tetris 99 game on the web: allow players to play the long-existing and famous Tetris in Battle Royale mode. Only one player would survive the game!
Winner winner, Vodka dinner.

# Description of the key features that will be completed by the Beta version:
Basic Tetris game play (single player mode), including Tetrimino, Mino, Matrix, Lock Down, Line Clear, Hard Drop, Soft Drop, Combo, Tetris Line Clear

# Description of additional features that will be complete by the Final version:
Battle Royale Mode, where a number of players compete with each other in the elimination game until one player remains playing. Users will be assigned into arenas and compete each other lively.

# Description of the technology that we will use
- JavaScript ES7
- Node.js
- HTTP3/QUIC
- TLS
- Mongo
- P2P UDP?
- WebSocket
- Vue.js
- Babel/Webpack
- Linux

# Description of our top 5 technical challenges
- Two-way synchronization between multiple players using WebSocket, the game should be playable at any network condition (even latency is high)
- Security. NO unauthorized users should fake a request, or eavedrop a eatablished connection
- Compatibility in multiple browsers, as different browsers use different enines, css implementation and api are different
- Real-time in-memory database read/write
- Anti-cheating, clients cannot be easily trusted without validation
# project-plusones

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
