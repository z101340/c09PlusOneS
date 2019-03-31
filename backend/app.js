/*jshint esversion: 6 */

const express = require('express');
const app = new express();

const cors = require("cors");

const session = require('express-session');

const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(session({
    secret: 'keyboard cat',
}));

const { MongoClient, ObjectId } = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/tetris";

class Matrix {
    constructor(width, height) {
        let matrix = [];
        for (let rowCount = 0; rowCount < height; rowCount++) {
            let row = [];
            for (let columnCount = 0; columnCount < width; columnCount++) {
                row.push(0);
            }
            matrix.push(row);
        }
        this.matrix = matrix;
    }
}

class Player  {
    constructor() {
        this.matrix = new Matrix(10, 20);
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
                hostSid: req.sessionID,
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
                    if (req.sessionID == dbRes.hostSid) {
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
                    if (req.sessionID == dbRes.value.hostSid) {
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
                } else {
                    res.status(500).json({ success: false, err: "no game matched" });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log("server started");
});