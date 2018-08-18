const { createServer } = require("http");
const next = require("next");
const routes = require("./routes");

const PORT = process.env.PORT || 3000;
const app = next({dev: process.env.NODE_ENV !== "production"});

app.prepare().then(() => 
    createServer(routes.getRequestHandler(app)).listen(PORT, err => {
        if (err) throw err;
        console.log(`Running on localhost:${PORT}`);
    }));