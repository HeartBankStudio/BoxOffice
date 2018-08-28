const IPFS = require("ipfs-api");

export default new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https"
});

