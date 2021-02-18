const express = require('express');
const cors = require('cors');

const filesRouter = require('./routers/filesRouter');
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(filesRouter);

app.listen(port, () => console.log("Server connected, port:", port));