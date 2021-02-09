const express = require("express");
const cors = require("cors");

const app = express();
const port = 4001;

app.use(cors());

app.get("*", () => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
