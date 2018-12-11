const optionalDependencies = require( '../package.json' ).optionalDependencies; /* eslint-disable-line prefer-destructuring */

if ( process.versions.node.split( '.' )[ 0 ] <= 7 ) {

    const keys = Object.keys( optionalDependencies );
    const notPresent = [];

    for ( let i = 0, key = keys[ i ]; i < keys.length; i++ ) {

        try {

            require.resolve( key );

        } catch ( error ) {

            notPresent.push( key );

        }

    }

    if ( notPresent.length === 0 ) {

        module.exports = require( './bootstrap' );

    } else {

        throw new Error(
            'You are running Node v' + process.versions.node + 'which does not support ' +
            'some of ES6 features. For that reason, you need to use Babel to transpile ' +
            'the library on-the-fly. You can do this by installing the following packages ' +
            notPresent.join( ', ' ) + '.'
        );

    }

} else {

    module.exports = {
        TwoFactor: require( './two-factor' ),
        ...require( './resources' )
    };

}
