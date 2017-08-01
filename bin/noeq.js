#! /usr/bin/env node

'use strict';

const options = require('commander');
const NoEq = require('./../src/NoEq');
const pckg = require('./../package.json');

options
.version(`${pckg.name} v${pckg.version}\n${pckg.description}`)
.usage('[options]')
.description(`${pckg.description}`)
.option('-p, --prompt [type]','Your prompt for NoEq, default: !=','!= ')
.option('-s, --precision [type]','precision for mathjs library value [0..16], default: 10 (http://mathjs.org/docs/reference/functions/format.html)','10')
.option('-l, --logLevel [type]','level for logging (dev porpouses), default: OFF','OFF')
.parse(process.argv);

var noeq = new NoEq(options);
// var noeq = neCw NoEq(null,5,'OFF');
// var noeq = new NoEq(null,5,'DEBUG');
noeq.on();
