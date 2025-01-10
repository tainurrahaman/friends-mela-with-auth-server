const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Friends mela is running");
});

app.listen(port, () => {
  console.log("Port is running on ", port);
});
