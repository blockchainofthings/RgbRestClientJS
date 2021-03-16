/**
 * Created by claudio on 2021-03-09
 */

const wpConfig = require('./webpack.config');

wpConfig.target = 'node';
wpConfig.resolve = {
    extensions: ['.js', '.mjs'],
    mainFields: ['main', 'module']
};

module.exports = wpConfig;
