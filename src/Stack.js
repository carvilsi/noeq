"use strict";

const colors  = require('colors');
const _       = require('lodash');
const loki    = require('lokijs');


// This class is to deal with the stack

class Stack {

  constructor(readLine, math, Logger) {
    this.readLine = readLine;
    this.math = math;
    this.Logger = Logger;
    this.stackLine = null;
  }

  setStackLine(stackLine) {
    this.stackLine = stackLine
  }

  print(stack) {
    this.Logger.debug(`Stack=  [${stack}]`)
    if (this.Logger.get().context.filterLevel.name === 'OFF') {
      console.log('\x1Bc');
    }
    for (var i = stack.length; i > 0; i--) {
      console.log(`${i}:`.gray + ` ${stack[stack.length-i]}`);
    }
    this.readLine.prompt();
    try {
      if (!_.isEmpty(stack)){
        this.stackLine.insert({state:stack.toString()});
      }
    } catch (e) {
      this.Logger.debug(e);
    }
  }

  arrayToFloat(array) {
    try {
      this.Logger.debug(`the array to convert: ${array}`);
      let str = array.join().replace(/\s/g,'').replace(/,/g,'');
      this.Logger.debug(`the string converted: ${str}`);
      let bn = this.math.bignumber(str);
      this.Logger.debug(`bn: ${bn}`);
      this.Logger.debug(`type bn: ${typeof bn}`);
      this.Logger.debug(`The big Integer: ${'d' in bn.d ? bn.d[0] : bn}`);
      return 'd' in bn.d ? bn.d[0] : bn;
    } catch (e) {
      this.Logger.error(e);
      return NaN;
    }
  }

  arrayToStr(array) {
    try {
      var str = array.join().replace(/\s/g,'').replace(/,/g,'');
      return str;
    } catch (e) {
      return null;
    }
  }

  operation(numOp,operation,stack) {
    if (stack.length >= numOp) {
      let lasts = _.drop(stack,stack.length - numOp);
      let dd = null;
      switch (numOp) {
        case 1:
          dd = this.math[operation](this.math.bignumber(lasts[0]));
          break;
        case 2:
          dd = this.math[operation](this.math.bignumber(lasts[0]),this.math.bignumber(lasts[1]));
          break;
        default:
          return stack;
      }
      if (dd == null) {
        return stack;
      }
      stack = _.dropRight(stack,numOp);
      stack = _.concat(stack,dd);
      this.Logger.debug(`${dd} :operation`);
      return stack;
    }
    return stack;
  }
}

module.exports = Stack;
