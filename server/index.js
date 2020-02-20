const app = require("./app");
const apiPort = 3000;
const db = require("./db");
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
