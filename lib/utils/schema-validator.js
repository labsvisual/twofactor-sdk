class SchemaValidator {

    constructor( schema ) {

        if ( typeof schema === 'string' ) {

            this.schema = require( schema );

        } else if ( typeof schema === 'object' ) {

            this.schema = schema;

        }

        this.errors = [];

    }

    _getType( param ) {

        return Object.prototype.toString.call( param )
            .split( ' ' )[ 1 ].replace( ']', '' ).toLowerCase();

    }

    _validateType( obj, key ) {

        const schemaObj = this.schema[ key ];

        if ( typeof obj === 'undefined' && !schemaObj.allowUndefined ) {

            this.errors.push( {
                key: '$root',
                error: `"${ key }": is required; got no value`
            } );

            return this.errors;

        }

        if ( ( typeof obj !== 'undefined' && !obj ) && !schemaObj.allowNull ) {

            this.errors.push( {
                key,
                error: `"${ key }": is required; got null`
            } );

            return this.errors;

        }

        let { allowedTypes } = schemaObj;
        if ( !allowedTypes ) {

            return;

        }

        if ( typeof allowedTypes === 'string' ) {

            allowedTypes = [ allowedTypes ];

        }

        const type = this._getType( obj );

        if ( allowedTypes.indexOf( type ) === -1 ) {

            this.errors.push( {
                key,
                error: `was expecting a ${ allowedTypes.join( ' or ' ) }; got ${ type }`
            } );

        }

    }

    _hasOwnProperty( obj, key ) {

        return Object.prototype.hasOwnProperty.call( obj, key );

    }

    _validateRequiredKeys( presentKeySet ) {

        const keyFilter = key => Boolean( ( this.schema[ key ] &&
            !this.schema[ key ].isOptional && !this.schema[ key ].when ) );

        const isAbsent = key => presentKeySet.indexOf( key ) === -1;

        const requiredKeys = Object.keys( this.schema )
            .filter( k => k.charAt( 0 ) !== '$' ).filter( keyFilter ).filter( isAbsent );

        const makeError = key => ( { key, error: `"${ key }": is required but not provided` } );
        const push = data => this.errors.push( data );
        const appendError = key => push( makeError( key ) );

        requiredKeys.forEach( appendError );

    }

    _validateWhenStatements( obj ) {

        const keyFilter = key => Boolean( this.schema[ key ] && this.schema[ key ].when );

        const keySet = Object.keys( this.schema )
            .filter( k => k.charAt( 0 ) !== '$' ).filter( keyFilter );

        for ( const key of keySet ) {

            const schemaObject = this.schema[ key ];
            const whenKey = schemaObject.when.key;

            if ( obj[ whenKey ] && !obj[ key ] ) {

                this.errors.push( {
                    key,
                    error: `"${ key }": is required when "${ whenKey }" is present`
                } );

            }

        }

    }

    _validateInnerKeys( obj ) {

        const currentKeys = [];

        for ( const child in obj ) {

            /* istanbul ignore if  */
            if ( !this._hasOwnProperty( obj, child ) ) {

                continue;

            }

            const childObject = obj[ child ];
            const schemaObject = this.schema[ child ];
            if ( !schemaObject ) {

                this.errors.push( {
                    key: child,
                    error: `Unexpected property "${ child }"`
                } );

                continue;

            }

            currentKeys.push( child );
            this._validateType( childObject, child );

        }

        this._validateWhenStatements( obj, currentKeys );
        this._validateRequiredKeys( currentKeys );

    }

    validate( obj ) {

        this.errors = [];

        this._validateType( obj, '$root' );
        this._validateInnerKeys( obj );

        return this.errors;

    }

}

module.exports = SchemaValidator;
