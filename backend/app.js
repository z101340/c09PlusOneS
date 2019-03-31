/*jshint esversion: 6 */

const express = require('express');
const expressWs = require('express-ws');
const app = new express();
expressWs(app);
const cors = require("cors");
const morgan = require('morgan');

const session = require('express-session');

const port = 3000;

const bodyParser = require('body-parser');

app.use(express.static('static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(session({
    secret: 'keyboard cat',
}));

app.use(express.static('public'))

const { MongoClient, ObjectId } = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/tetris";

let wsGames = {};
let wsClients = {};

class Player  {
    constructor() {
        const height = 20;
        const width = 10;
        let matrix = [];
        for (let rowCount = 0; rowCount < height; rowCount++) {
            let row = [];
            for (let columnCount = 0; columnCount < width; columnCount++) {
                row.push(0);
            }
            matrix.push(row);
        }
        this.matrix = matrix;
        this.score = 0;
    }
}

app.post('/api/game', (req, res) => {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {
            const dbo = db.db("tetris");
            const emptyGame = {
                host: new Player(),
                guest: new Player(),
                hasStarted: false
            };

            dbo.collection("games").insertOne(emptyGame, function(err, dbRes) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        err
                    });
                } else {
                    const id = dbRes.insertedId;
                    req.session[id]  = {
                        isHost: true
                    };
                    res.json({
                        success: true,
                        id
                    });
                }
            });
        }
    });
});

app.get('/api/game/:id', function (req, res) {
    const id = req.params.id;
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, err });
        } else if (!ObjectId.isValid(id)) {
            res.status(422).json({ success: false, err: "bad id input" });
        } else {
            const dbo = db.db("tetris");
            dbo.collection("games").findOne({ _id: new ObjectId(id) }, function (err, dbRes) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, err });
                } else if (dbRes) {
                    let isHost;
                    let players = {};
                    if (req.session[id] && req.session[id].isHost) {
                        players = {
                        // client is host
                            you: dbRes.host,
                            opponent: dbRes.guest,
                        };
                        isHost = true;
                    } else {
                        players = {
                            opponent: dbRes.host,
                            you: dbRes.guest,
                        };
                        isHost = false;
                        if (!req.session[id]) {
                            req.session[id] = { isHost: false};
                        }
                    }
                    const result = {
                        players,
                        isHost,
                        hasStarted: dbRes.hasStarted
                    };
                    res.json({ success: true, result });
                } else {
                    res.status(500).json({ success: false, err: "no game matched" });
                }
            });
        }
    });
});

app.patch('/api/game/:id', function (req, res) {
    const id = req.params.id;
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, err });
        } else if (!ObjectId.isValid(id)) {
            res.status(422).json({ success: false, err: "bad id input" });
        } else {
            const dbo = db.db("tetris");
            dbo.collection("games").findOneAndUpdate({ _id: new ObjectId(id) },
             { $set: {hasStarted: true}}, {returnNewDocument: true}, function (err, dbRes) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, err });
                }else if (dbRes) {
                    let players = {};
                    let isHost;
                    if (req.session.isHost) {
                        players = {
                        // client is host
                            you: dbRes.value.host,
                            opponent: dbRes.value.guest,
                        };
                        isHost = true;
                    } else {
                        players = {
                            opponent: dbRes.value.host,
                            you: dbRes.value.guest,
                        };
                        isHost = false;
                    }
                    const result = {
                        players,
                        isHost,
                        hasStarted: dbRes.value.hasStarted
                    };
                    res.json({ success: true, result });
                    // inform the host
                    const tell = wsGames[id].host;
                    if (tell && tell.readyState == 1) {
                        tell.send(JSON.stringify({
                            method: "guestJoined",
                        }));
                    }
                } else {
                    res.status(500).json({ success: false, err: "no game matched" });
                }
            });
        }
    });
});

connects = [];
app.ws('/api/game/:id/chat', function(ws, req) {
    connects.push(ws);
    console.log(req.sessionID);
    ws.on('message', function(message) {
        console.log('Received -', message);
        connects.forEach(socket => {
            socket.send(message);
        });
    });

    ws.on('close', function(){
      connects = connects.filter(conn => {
        return (conn === ws) ? false : true;
      });
    }); 
});

app.ws('/api/game/:id/ws', function(ws, req) {
    const sessionID = req.sessionID;
    const id = req.params.id;
    let isHost = false;
    if (!wsGames[id]) {
        wsGames[id] = {};
    }
    if (req.session[id] && req.session[id].isHost) {
        isHost = true;
        wsGames[id].host = ws;
    } else {
        wsGames[id].guest = ws;
        if (!req.session[id]) {
            req.session[id] = { isHost: false };
        }
    }


    MongoClient.connect(mongoUrl, function (err, db) {
        if (!err && ObjectId.isValid(id)) {
            const dbo = db.db("tetris");
            dbo.collection("games").findOne({ _id: new ObjectId(id) }, function (err, dbRes) {
            });
        }
    });
    ws.on("message", function (message) {
        const data = JSON.parse(message);
        const isHost = req.session[id].isHost;
        const player = isHost ? "host" : "guest";
        const otherPlayer = isHost ? "guest" : "host";
        if (data.method == "updateMatrix") {
            const matrix = data.matrix;
            const score = data.score;
            const next = data.next;
            const hold = data.hold;
            MongoClient.connect(mongoUrl, function (err, db) {
                if (!err && ObjectId.isValid(id)) {
                    const dbo = db.db("tetris");
                    let update = { $set: {} };
                    update.$set[player] = { matrix, score };
                    dbo.collection("games").findOneAndUpdate({ _id: new ObjectId(id) }, update, function (err, res) {
                        if (wsGames[id][otherPlayer] && wsGames[id][otherPlayer].readyState == 1) {
                            wsGames[id][otherPlayer].send(JSON.stringify({
                                method: "updateOpponentMatrix",
                                matrix,
                                score,
                                next,
                                hold
                            }));
                        }
                    });
                }
            });
        } else if (data.method == "die") {
            if (wsGames[id][otherPlayer] && wsGames[id][otherPlayer].readyState == 1) {
                wsGames[id][otherPlayer].send(JSON.stringify({
                    method: "win"
                }));
            }
        }
    });
});

app.listen(port, () => {
    console.log("server started");
});