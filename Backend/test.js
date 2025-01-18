const express = require("express");
const app = express();
app.post('/login', (req, res) => {
    res.status(200).send("Mock endpoint working!");
});