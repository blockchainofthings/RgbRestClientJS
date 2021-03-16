/**
 * Created by claudio on 2021-03-09
 */

const rgbRestClient = require('../src/index');
const expect = require('chai').expect;

const testSuite = require('./suite/RgbRestClientSuite');

testSuite(rgbRestClient, expect);
