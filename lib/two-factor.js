const Resources = require( './resources' );

class TwoFactor {

    constructor( apiKey ) {

        for( const resource in Resources ) {

            const ResourceObject = Resources[ resource ];

            Object.assign( this, {
                [ resource ]: new ResourceObject( apiKey )
            } );

        }

    }

}

module.exports = TwoFactor;
