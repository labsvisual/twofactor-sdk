const { expect } = require( 'chai' );

const ApiBase = require('../lib/base');

describe( '# API Base', () => {

    it( 'throws an Error when an undefined or null value is provided as the API Key', () => {

        expect( () => new ApiBase() ).to.throw( Error );
        expect( () => new ApiBase( null ) ).to.throw( Error );

    } );

    it( 'initializes correctly on proper parameters', () => {

        const instance = new ApiBase( 'd3aa88e2-c754-41e0-8ba6-4198a34aa0a2' );
        
        expect( instance._request ).to.be.a( 'function' );

    } );

    describe( '## API Key Validation', () => {

        const testCases = [ 12345, () => {}, {}, [] ];
        for( const testCase of testCases ) {

            it( `throws a TypeError when the API Key is not a string: <${ typeof testCase }>`, () => {

                expect( () => new ApiBase( testCase ) ).to.throw( TypeError );

            } );

        }

        const invalidApiKeys = [
            '1234',
            'd3aa88e2-c754-41e0-8ba6-4198a34aa',
            'd3aa88e2c75441e08ba64198a34aa0a2'
        ];

        for( const testCase in invalidApiKeys ) {

            it( `throws a TypeError when the API key is not properly formatted: <case ${ testCase }>`, () => {

                expect( () => new ApiBase( invalidApiKeys[ testCase ] ) ).to.throw( TypeError );

            } );

        }

    } );

} );
