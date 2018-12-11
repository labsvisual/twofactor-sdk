const Resources = require( './resources' );

class TwoFactor {

    constructor( apiKey ) {

        for ( const resource in Resources ) {

            if ( !Object.prototype.hasOwnProperty.call( Resources, resource ) ) {

                continue;

            }

            const ResourceObject = Resources[ resource ];

            Object.assign( this, {
                [ resource.toUpperCase() ]: new ResourceObject( apiKey )
            } );

        }

    }

}

module.exports = TwoFactor;
