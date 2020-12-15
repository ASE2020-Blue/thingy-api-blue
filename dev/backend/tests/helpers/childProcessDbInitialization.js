const { exec } = require('child_process');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];

async function runCommand (commandString) {
    await new Promise((resolve, reject) => {
        const migrate = exec(commandString, { env: process.env }, err => (err ? reject(err) : resolve()));

        // Forward stdout+stderr to this process
        // migrate.stdout.pipe(process.stdout);
        // migrate.stderr.pipe(process.stderr);
    });
}

module.exports.initTestDb = async function () {
    await runCommand(`test -e ${config.storage} && rm ${config.storage} || echo "go with tests"`);
    await runCommand('yarn run db:migrate');
    await runCommand('yarn run db:seed');
}
