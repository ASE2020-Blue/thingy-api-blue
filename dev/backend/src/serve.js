const app = require('../src/server/server')
const { createGRpcServer } = require('./services/server');


const PORT = process.env.PORT || 8080;
app.listen(PORT);

createGRpcServer();

