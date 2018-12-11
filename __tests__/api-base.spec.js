const test = require( 'tape' );

const ApiBase = require( '../lib/base' );

test( 'throws an Error when an undefined or null value is provided as the API Key', t => {

    t.throws( () => new ApiBase(), Error );
    t.throws( () => new ApiBase( null ), Error );

    t.end();

} );

test( 'initializes correctly on proper parameters', t => {

    const instance = new ApiBase( 'd3aa88e2-c754-41e0-8ba6-4198a34aa0a2' );

    t.equal( typeof instance._request, 'function' );
    t.end();

} );

const testCases = [ 12345, () => {}, {}, [] ];
for ( const testCase of testCases ) {

    test( `throws a TypeError when the API Key is not a string: <${ typeof testCase }>`, t => {

        t.throws( () => new ApiBase( testCase ), TypeError );
        t.end();

    } );

}

const invalidApiKeys = [
    '1234',
    'd3aa88e2-c754-41e0-8ba6-4198a34aa',
    'd3aa88e2c75441e08ba64198a34aa0a2'
];

for ( const testCase in invalidApiKeys ) {

    if ( !Object.prototype.hasOwnProperty.call( invalidApiKeys, testCase ) ) {

        continue;

    }

    test( `throws a TypeError when the API key is not properly formatted: <case ${ testCase }>`, t => {

        t.throws( () => new ApiBase( invalidApiKeys[ testCase ] ), TypeError );
        t.end();

    } );

}
