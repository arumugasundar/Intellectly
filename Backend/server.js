const express = require("express");
const app = express();
const PORT = 4000;
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const url = require("./db").url;
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Mongoose Connected"))
    .catch(err => {
        console.log(err);
    });

app.use("/auth", require("./auth"))
app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
