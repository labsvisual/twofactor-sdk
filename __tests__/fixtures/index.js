const { TwoFactor } = require( '../../lib' );
const Mocker = require( './mocker' );

module.exports = {
    mocker: new Mocker( 'd3aa88e2-c754-41e0-8ba6-4198a34aa0a2' ),
    Fixtures: require( './fixtures' ),
    TwoFactor: new TwoFactor( 'd3aa88e2-c754-41e0-8ba6-4198a34aa0a2' )
};
