const { SERVER_PORT } = require("./config");
const { createServer } = require("http");
const next = require("next");
const routes = require("./routes");
const app = next({dev: process.env.NODE_ENV !== "production"});

app.prepare().then(() => 
    createServer(routes.getRequestHandler(app)).listen(SERVER_PORT, err => {
        if (err) throw err;
        console.log(`Running on localhost:${SERVER_PORT}`);
    }));