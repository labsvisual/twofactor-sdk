require( '@babel/register' );
require( '@babel/polyfill' );

module.exports = {
    TwoFactor: require( './two-factor' )
};
