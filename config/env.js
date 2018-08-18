if (process.env.NODE_ENV === "production") {
    module.exports = {
        ENDPOINT: process.env.INFURA 
    };
} else {
    module.exports = require("./keys");
}