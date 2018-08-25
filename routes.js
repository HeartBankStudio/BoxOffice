const routes = require("next-routes")();

routes
    .add("/movie/make", "/movie/make")
    .add("/movie/:movie/update", "/movie/make")
    .add("/movie/:movie", "/movie/index")
    .add("/theater/:movie", "/theater/index");

module.exports = routes;