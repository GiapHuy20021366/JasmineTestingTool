const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename);

const controllers = {}

fs
    .readdirSync(path.resolve(__dirname))
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const controller = require(path.join(__dirname, file));
        controllers[controller.name] = controller
    });

module.exports = controllers;