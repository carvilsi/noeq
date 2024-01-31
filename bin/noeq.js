#! /usr/bin/env node

'use strict';

const options = require('commander');
const NoEq = require('./../src/index');
const pckg = require('./../package.json');

options
.version(`${pckg.name} v${pckg.version}\n${pckg.description}`)
.usage('[options]')
.description(`${pckg.description}\n
               __                              
              |  |         _____     _____     
              |  |_____   |   | |___|   __|___ 
              |__|_____|  | | | | . |   __| . |
              |__|_____|  |_|___|___|_____|_  |
                                            |_|
 
 Keymap

      ctr-c: 'exit' Stops NoEq and prompt asking if the current stack must be persisted on a file for further use on the next session.

  Stack manipulation

      up: 'reverse' Performs a reverse operation over the stack elements
      left: 'drop' Deletes the first element on the stack
      right: 'swap' Swaps the two first elements on the stack
      down: 'first' Swaps position of the first and last elements on the stack
      ctr-z: 'undo' Performs an undo over the stack, return it to the previous state

  Math functions

      +: add    -: subtract    /: divide    *: multiply
      p: pow    c: cos         C: sec       s: sin
      S: csc    t: tan         T: cot       r: sqrt`)
.option('-p, --prompt [type]','Your prompt for NoEq','!= ')
.option('-s, --precision [type]',`precision for mathjs library value [0..16], 
        default: 10 (http://mathjs.org/docs/reference/functions/format.html)`,'10')
.option('-l, --logLevel [type]','level for logging (dev porpouses), default: OFF','OFF')
.parse(process.argv);

var noeq = new NoEq(options);
noeq.on();

