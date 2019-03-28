/*jshint esversion: 6 */

const express = require('express');
const app = new express();

const cors = require("cors");

const session = require('express-session');

const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: 'keyboard cat',
}));

const { MongoClient, ObjectId } = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/tetris";

class Player  {
    constructor() {
        this.matrix = [];
        this.score = 0;
        this.sid = '';
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

app.post('/api/game/:id', function (req, res) {
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
                }else if (dbRes) {
                    let you = {};
                    let opponent = {};
                    if (req.sessionID == dbRes.hostSid) {
                        // client is host
                        you = dbRes.host;
                        opponent = dbRes.guest;
                    } else {
                        you = dbRes.guest;
                        opponent = dbRes.host;
                    }
                    res.json({ success: true, result: {
                        you,
                        opponent
                    } });
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