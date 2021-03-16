/**
 * Created by claudio on 2021-03-09
 */

const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'umd'),
        filename: 'rgb-rest-client.js',
        library: 'rgbRestClient',
        libraryTarget: 'umd'
    }
};
