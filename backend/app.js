/*jshint esversion: 6 */

const express = require('express');
const app = new express();

const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const {MongoClient, ObjectId} = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/tetris";

class Player  {
    constructor() {
        this.matrix = [];
        this.score = 0;
    }
}

app.post('/api/newgame', (req, res) => {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {
            const dbo = db.db("tetris");
            const emptyGame = {
                starter: new Player(),
                opponent: new Player(),
                isFilled: false
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

app.post('/api/joingame', function (req, res) {
    const id = req.body.id;
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, err});
        } else if (!ObjectId.isValid(id)) {
            res.status(422).json({success: false, err: "bad id input"});
        } else {
            const dbo = db.db("tetris");
            dbo.collection("games").updateOne({_id: new ObjectId(id), isFilled: false}, {$set: { isFilled: true}}, function (err, dbRes) {
                if (err) {
                    console.log(err);
                    res.status(500).json({success: false, err});
                } else {
                    res.json({success: true, result: dbRes.result});
                }
            });
        }
    });
});

app.listen(8000, () => {
    console.log("server started");
});