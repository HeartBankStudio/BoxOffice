module.exports = {
    webpack (config) {
        // console.log(config);
        // config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin');
        return config;
    }
}