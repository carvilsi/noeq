"use strict";

const _ = require('lodash');
const Stack = require('./Stack');

class StackOps extends Stack {

  constructor(readLine, math, Logger) {
    super(readLine,math,Logger);
    this.readLine = readLine;
    this.math = math;
    this.Logger = Logger;
  }

  drop(stack) {
    this.Logger.debug(stack);
    stack = _.dropRight(stack);
    return stack;
  }

  swap(stack) {
    let lasts = _.drop(stack,stack.length - 2);
    lasts = _.reverse(lasts);
    stack = _.dropRight(stack,2);
    stack = _.concat(stack,lasts);
    return stack;
  }

  reverse(stack) {
    stack = _.reverse(stack);
    return stack;
  }

  last(stack) {
    if (stack.length > 0) {
      let last = stack[stack.length-1]
      this.readLine.write(String(last));
      let tmp = String(last).split("");
      return tmp;
    } else {
      return stack;
    }
  }

  first(stack)  {
    if (stack.length > 0) {
      let first = _.head(stack);
      stack = _.tail(stack);
      stack = _.concat(stack,first);
      return stack;
    } else {
      return stack;
    }
  }

  operation(numOp, stack) {
    if (stack.length >= numOp) {
      let lasts = _.drop(stack,stack.length - 2);
      let dd = this.math.multiply(this.math.bignumber(lasts[0]), this.math.bignumber(lasts[1]));
      stack = _.dropRight(stack,2);
      stack = _.concat(stack,dd);
      this.Logger.debug(`${dd} :add`);
      return stack;
    }
    return stack;
  }
}

module.exports = StackOps;
