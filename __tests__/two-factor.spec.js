const test = require( 'tape' );

const ApiBase = require( '../lib/base' );
const { TwoFactor } = require('./fixtures');

const resources = [ 'OTP' ];

for( const resource of resources ) {

    test( `has the resource - ${ resource }`, t => {

        t.equal( typeof TwoFactor[ resource ], 'object' );
        t.end();

    } );

    test( `correctly initializes a new instance of the resource - ${ resource }`, t => {

        t.ok( TwoFactor[ resource ] instanceof ApiBase );
        t.end();

    } );

}
