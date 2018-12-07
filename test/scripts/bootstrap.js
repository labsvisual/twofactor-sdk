#! /usr/bin/env node
if (process.versions.node.split('.')[0] <= 7) {
  console.log('nyc --require @babel/register mocha');
} else {
  console.log('nyc mocha');
}
