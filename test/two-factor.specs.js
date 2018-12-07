const { expect } = require( 'chai' );

const ApiBase = require( '../lib/base' );
const { TwoFactor } = require('../lib');

describe( '# TwoFactor', () => {

    describe( '## Resources', () => {

        const resources = [ 'OTP' ];
        const twoFactor = new TwoFactor( '95e8a37a-e219-4a26-b7b8-194cfc0cd478' );

        for( const resource of resources ) {

            describe( `### ${ resource }`, () => {

                it( `has the resource`, () => {

                    expect( twoFactor ).to.have.own.property( resource );

                } );

                it( `correctly initializes a new instance of the resource`, () => {

                    expect( twoFactor[ resource ] ).to.be.an.instanceof( ApiBase );

                } );

            } );

        }

    } );

} );
