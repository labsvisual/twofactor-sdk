#! /usr/bin/env node
if ( process.versions.node.split( '.' )[ 0 ] <= 7 ) {

    console.log( 'nyc --require @babel/register tape ./__tests__/*.spec.js ./__tests__/**/*.spec.js' );

} else {

    console.log( 'nyc tape ./__tests__/*.spec.js ./__tests__/**/*.spec.js' );

}
