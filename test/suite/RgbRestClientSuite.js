/**
 * Created by claudio on 2021-03-09
 */

(function () {
    const testSuite = function suite(rgbRestClient, expect) {
        describe('RGB REST Client', function () {
            it('should instantiate client with default options', function () {
                const rgb = new rgbRestClient.RgbRestClient();

                expect(rgb).to.have.property('network', 'testnet');
                expect(rgb).to.have.property('rootApiEndPoint', 'https://rgb.blockchainofthings.com/api/1.1/');
            });

            it('should instantiate client with specific options', function () {
                const rgb = new rgbRestClient.RgbRestClient({
                    network: 'signet',
                    host: 'localhost:3060',
                    secure: false,
                    version: '1.0'
                });

                expect(rgb).to.have.property('network', 'signet');
                expect(rgb).to.have.property('rootApiEndPoint', 'http://localhost:3060/api/1.0/');
            });

            describe('Issue Fungible Asset', function () {
                const rgb = new rgbRestClient.RgbRestClient({
                    network: 'signet',
                    host: 'localhost:3060',
                    secure: false,
                    version: '1.1'
                });

                describe('Call using callback', function () {
                    it('should return an error if a network error takes place', function (done) {
                        // Simulate a network error by passing an invalid host
                        const rgb2 = new rgbRestClient.RgbRestClient({
                            network: 'signet',
                            host: 'localhost:9999',
                            secure: false,
                            version: '1.1'
                        });

                        rgb2.issueFungible(
                            'TST1',
                            'Test asset #1',
                            0,
                            {
                                coins:123,
                                outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:4'
                            },
                            {
                                description:'RGB asset used for testing RGB REST client'
                            },
                            (err, data) => {
                                let error;

                                try {
                                    expect(err).to.exist.and.be.an.instanceof(Error).and.have.property('message')
                                    .that.match(/^Error calling POST request:/);
                                }
                                catch(err) {
                                    error = err;
                                }

                                done(error);
                            }
                        );
                    });

                    it('should return an error if an invalid param is passed', function (done) {
                        rgb.issueFungible(
                            '',
                            '',
                            0,
                            [],
                            (err, data) => {
                                let error;

                                try {
                                    expect(err).to.exist.and.be.an.instanceof(rgbRestClient.RgbRestError)
                                    expect(err).to.have.property(
                                        'httpStatusCode',
                                        400
                                    )
                                    expect(err).to.have.property(
                                        'httpStatusMessage',
                                        'Bad Request'
                                    )
                                    expect(err).to.have.property(
                                        'apiErrorMessage',
                                        'Invalid parameters'
                                    )
                                    expect(err).to.have.property(
                                        'message',
                                        'Error returned from RGB REST API endpoint: [400] Invalid parameters'
                                    );
                                }
                                catch(err) {
                                    error = err;
                                }

                                done(error);
                            }
                        );
                    });

                    it('should get success response from API method', function (done) {
                        rgb.issueFungible(
                            'TST1',
                            'Test asset #1',
                            0,
                            {
                                coins:123,
                                outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:4'
                            },
                            {
                                description:'RGB asset used for testing RGB REST client'
                            },
                            (err, data) => {
                                let error;

                                try {
                                    expect(data).to.exist.and.be.an('object').with.property('assetInfo');
                                }
                                catch(err) {
                                    error = err;
                                }

                                done(error);
                            }
                        );
                    });
                });

                describe('Call using promise', function () {
                    it('should return a rejected promise if a network error takes place', function (done) {
                        // Simulate a network error by passing an invalid host
                        const rgb2 = new rgbRestClient.RgbRestClient({
                            network: 'signet',
                            host: 'localhost:9999',
                            secure: false,
                            version: '1.1'
                        });

                        let error;

                        rgb2.issueFungible(
                            'TST1',
                            'Test asset #1',
                            0,
                            {
                                coins:123,
                                outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:4'
                            },
                            {
                                description:'RGB asset used for testing RGB REST client'
                            }
                        )
                        .then(function (res) {
                            error = new Error('Promise should have been rejected');
                        }, function (err) {
                            expect(err).to.exist.and.be.an.instanceof(Error).and.have.property('message')
                            .that.match(/^Error calling POST request:/);
                        })
                        .catch(function (err) {
                            error = err;
                        })
                        .finally(function () {
                            done(error);
                        });
                    });

                    it('should return a rejected promise if an invalid param is passed', function (done) {
                        let error;

                        rgb.issueFungible(
                            '',
                            '',
                            0,
                            []
                        )
                        .then(function (res) {
                            error = new Error('Promise should have been rejected');
                        }, function (err) {
                            expect(err).to.exist.and.be.an.instanceof(rgbRestClient.RgbRestError)
                            expect(err).to.have.property(
                                'httpStatusCode',
                                400
                            )
                            expect(err).to.have.property(
                                'httpStatusMessage',
                                'Bad Request'
                            )
                            expect(err).to.have.property(
                                'apiErrorMessage',
                                'Invalid parameters'
                            )
                            expect(err).to.have.property(
                                'message',
                                'Error returned from RGB REST API endpoint: [400] Invalid parameters'
                            );
                        })
                        .catch(function (err) {
                            error = err;
                        })
                        .finally(function () {
                            done(error);
                        });
                    });

                    it('should get success response from API method', function (done) {
                        let error;

                        rgb.issueFungible(
                            'TST2',
                            'Test asset #2',
                            0,
                            {
                                coins:234,
                                outpoint:'5c1cb187a0d80955f87d65e3b798b5975362aa5e6f48d99a293bf162606fbdaa:5'
                            },
                            {
                                description:'RGB asset used for testing RGB REST client'
                            }
                        )
                        .then(function (data) {
                            expect(data).to.exist.and.be.an('object').with.property('assetInfo');
                        }, function (err) {
                            error = new Error('Promise should have been resolved');
                        })
                        .catch(function (err) {
                            error = err;
                        })
                        .finally(function () {
                            done(error);
                        });
                    });
                });
            });

            describe('Retrieve Wallet UTXOs', function () {
                const rgb = new rgbRestClient.RgbRestClient({
                    network: 'signet',
                    host: 'localhost:3060',
                    secure: false,
                    version: '1.1'
                });

                describe('Call using callback', function () {
                    it('should return an error if an invalid param is passed', function (done) {
                        rgb.walletUtxos(
                            '',
                            {
                                keyRangeStartIdx: -1,
                                keyRangeCount: 0
                            },
                            (err, data) => {
                                let error;

                                try {
                                    expect(err).to.exist.and.be.an.instanceof(rgbRestClient.RgbRestError)
                                    expect(err).to.have.property(
                                        'httpStatusCode',
                                        400
                                    )
                                    expect(err).to.have.property(
                                        'httpStatusMessage',
                                        'Bad Request'
                                    )
                                    expect(err).to.have.property(
                                        'apiErrorMessage',
                                        'Invalid parameters'
                                    )
                                    expect(err).to.have.property(
                                        'message',
                                        'Error returned from RGB REST API endpoint: [400] Invalid parameters'
                                    );
                                }
                                catch(err) {
                                    error = err;
                                }

                                done(error);
                            }
                        );
                    });

                    it('should get success response from API method', function (done) {
                        rgb.walletUtxos(
                            'wpkh(tprv8e27dYug4Xvv7Cuwyqo3hmk39kQPhzy7zR4o1JCAWtSVWtc2uMh4JfnQXjWrh3N7c2g7dcVQGvesRiWJERDmf4TERsBCwG8yXAT2TtpYhzt/*\')',
                            {
                                keyRangeStartIdx: 0,
                                keyRangeCount: 100
                            },
                            (err, data) => {
                                let error;

                                try {
                                    expect(data).to.exist.and.be.an('object')
                                    .with.property('utxos')
                                    .that.is.an('array');

                                    if (data.utxos.length > 0) {
                                        const utxo = data.utxos[0];

                                        expect(utxo).to.be.an('object');
                                        expect(utxo).to.have.property('txid')
                                        .that.is.a('string');
                                        expect(utxo).to.have.property('vout')
                                        .that.is.a('number');
                                        expect(utxo).to.have.property('amount')
                                        .that.is.a('number');
                                        expect(utxo).to.have.property('height')
                                        .that.is.a('number');
                                    }
                                }
                                catch(err) {
                                    error = err;
                                }

                                done(error);
                            }
                        );
                    });
                });

                describe('Call using promise', function () {
                    it('should return a rejected promise if an invalid param is passed', function (done) {
                        let error;

                        rgb.walletUtxos(
                            '',
                            {
                                keyRangeStartIdx: -1,
                                keyRangeCount: 0
                            }
                        )
                        .then(function (res) {
                            error = new Error('Promise should have been rejected');
                        }, function (err) {
                            expect(err).to.exist.and.be.an.instanceof(rgbRestClient.RgbRestError)
                            expect(err).to.have.property(
                                'httpStatusCode',
                                400
                            )
                            expect(err).to.have.property(
                                'httpStatusMessage',
                                'Bad Request'
                            )
                            expect(err).to.have.property(
                                'apiErrorMessage',
                                'Invalid parameters'
                            )
                            expect(err).to.have.property(
                                'message',
                                'Error returned from RGB REST API endpoint: [400] Invalid parameters'
                            );
                        })
                        .catch(function (err) {
                            error = err;
                        })
                        .finally(function () {
                            done(error);
                        });
                    });

                    it('should get success response from API method', function (done) {
                        let error;

                        rgb.walletUtxos(
                            'wpkh(tprv8e27dYug4Xvv7Cuwyqo3hmk39kQPhzy7zR4o1JCAWtSVWtc2uMh4JfnQXjWrh3N7c2g7dcVQGvesRiWJERDmf4TERsBCwG8yXAT2TtpYhzt/*\')',
                            {
                                keyRangeStartIdx: 0,
                                keyRangeCount: 100
                            }
                        )
                        .then(function (data) {
                            expect(data).to.exist.and.be.an('object')
                            .with.property('utxos')
                            .that.is.an('array');

                            if (data.utxos.length > 0) {
                                const utxo = data.utxos[0];

                                expect(utxo).to.be.an('object');
                                expect(utxo).to.have.property('txid')
                                .that.is.a('string');
                                expect(utxo).to.have.property('vout')
                                .that.is.a('number');
                                expect(utxo).to.have.property('amount')
                                .that.is.a('number');
                                expect(utxo).to.have.property('height')
                                .that.is.a('number');
                            }
                        }, function (err) {
                            error = new Error('Promise should have been resolved');
                        })
                        .catch(function (err) {
                            error = err;
                        })
                        .finally(function () {
                            done(error);
                        });
                    });
                });
            });
        })
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = testSuite;
    }
    else {
        this.testSuite = testSuite;
    }
})();
