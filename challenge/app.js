const express = require("express");
const app = express();
const port = 8080;

const morgan = require("morgan");
app.use(morgan("dev")); //middleware logging
app.use(express.json()); //middleware body

const router = require("./routes");
app.use(router);

app.use((req, res, next) => {
  return res.status(404).json({
    message: `cant find ${req.url}`,
  });
  next();
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

app.listen(port, () => console.log("running on port", port));
