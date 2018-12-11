const path = require( 'path' );
const test = require( 'tape' );
const { SchemaValidator } = require( '../../lib/utils' );
const { Fixtures } = require( '../fixtures' );

test( 'accepts string and object for schema definition', t => {

    try {

        let validatorObject = new SchemaValidator( Fixtures.exampleSchema ); // eslint-disable-line no-unused-vars
        validatorObject = new SchemaValidator(
            path.join( __dirname, '../fixtures/schema.json' )
        );

        t.pass( 'accepts string and object for schema' );
        t.end();

    } catch ( error ) {

        throw error;

    }

} );

test( 'validates the root element correctly', t => {

    let validator = new SchemaValidator( Fixtures.exampleSchema );

    let validateResult = validator.validate();

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, '$root' );
    t.ok( validateResult[ 0 ].error );

    validateResult = validator.validate( null );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, '$root' );
    t.ok( validateResult[ 0 ].error );

    validator = new SchemaValidator( Object.assign( {}, Fixtures.exampleSchema, {
        $root: {
            allowUndefined: true
        }
    } ) );

    validateResult = validator.validate();
    t.equal( validateResult.length, 0 );

    validator = new SchemaValidator( Object.assign( {}, Fixtures.exampleSchema, {
        $root: {
            allowNull: true
        }
    } ) );

    validateResult = validator.validate( null );
    t.equal( validateResult.length, 0 );

    t.end();

} );

test( 'validates the type of the parameter envelope', t => {

    let validator = new SchemaValidator( Fixtures.exampleSchema );

    let validateResult = validator.validate( [] );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, '$root' );
    t.ok( validateResult[ 0 ].error.indexOf( 'got array' ) > -1 );

    validator = new SchemaValidator( Object.assign( {}, Fixtures.exampleSchema, {
        $root: {
            allowedTypes: 'string'
        }
    } ) );

    validateResult = validator.validate( {} );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, '$root' );
    t.ok( validateResult[ 0 ].error.indexOf( 'got object' ) > -1 );

    t.end();

} );

test( 'gives an error when a property is not mentioned in the schema', t => {

    const validator = new SchemaValidator( Object.assign( {}, Fixtures.exampleSchema, {
        test: undefined
    } ) );

    const validateResult = validator.validate( {
        test: 'hello!'
    } );

    t.equals( validateResult.length, 1 );
    t.ok( validateResult[ 0 ].error.indexOf( 'Unexpected property' ) > -1 );

    t.end();

} );

test( 'validates a child', t => {

    const validator = new SchemaValidator( Fixtures.exampleSchema );

    let validateResult = validator.validate( {
        test: 'hello!'
    } );

    t.equals( validateResult.length, 0 );

    validateResult = validator.validate( {
        test: []
    } );

    t.equals( validateResult.length, 1 );

    t.end();

} );

test( 'validates a complex schema', t => {

    const schema = {
        $root: {
            allowUndefined: false,
            allowNull: false,
            allowedTypes: [ 'string', 'object' ]
        },
        test: {
            allowedTypes: 'string'
        },
        testTwo: {
            isOptional: true,
            allowedTypes: 'string'
        },
        newProperty: {
            when: {
                key: 'test'
            },
            allowedTypes: [ 'boolean', 'string' ]
        },
        whenValue: {
            when: {
                key: 'testThree',
                value: 'hello'
            },
            allowedTypes: 'string',
            oneOf: [ 'foo', 'bar' ]
        },
        testThree: {
            isOptional: true,
            allowedTypes: 'string'
        }
    };

    let validator = new SchemaValidator( schema );

    let validateResult = validator.validate( {
        testTwo: 'hello'
    } );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, 'test' );
    t.ok( validateResult[ 0 ].error.indexOf( 'is required' ) );

    validator = new SchemaValidator( Object.assign( {}, schema, {
        newProperty: undefined
    } ) );

    validateResult = validator.validate( {
        test: 'stuff'
    } );

    t.equal( validateResult.length, 0 );

    validator = new SchemaValidator( schema );

    validateResult = validator.validate( {
        test: 'stuff'
    } );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, 'newProperty' );
    t.ok( validateResult[ 0 ].error.indexOf( 'is required when' ) > -1 );

    validateResult = validator.validate( {
        test: 'stuff',
        newProperty: true
    } );

    t.equal( validateResult.length, 0 );

    validateResult = validator.validate( {
        test: 'stuff',
        newProperty: 'hello'
    } );

    t.equal( validateResult.length, 0 );

    validateResult = validator.validate( {
        test: 'stuff',
        newProperty: []
    } );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, 'newProperty' );
    t.ok( validateResult[ 0 ].error.indexOf( 'got array' ) > -1 );

    validateResult = validator.validate( {
        testThree: 'helloz',
        test: 'stuff',
        newProperty: 'test'
    } );

    t.ok( validateResult );

    validateResult = validator.validate( {
        testThree: 'hello',
        test: 'stuff',
        newProperty: 'test'
    } );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, 'whenValue' );
    t.ok( validateResult[ 0 ].error.indexOf( 'is required when' ) > -1 );

    validateResult = validator.validate( {
        testThree: 'hello',
        test: 'stuff',
        newProperty: 'test',
        whenValue: 'too'
    } );

    t.equal( validateResult.length, 1 );
    t.equal( validateResult[ 0 ].key, 'whenValue' );
    t.ok( validateResult[ 0 ].error.indexOf( 'one of foo' ) > -1 );

    validateResult = validator.validate( {
        testThree: 'hello',
        test: 'stuff',
        newProperty: 'test',
        whenValue: 'foo'
    } );

    t.ok( validateResult );

    t.end();

} );
