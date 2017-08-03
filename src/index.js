"use strict";

const readline = require('readline');
const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const math = require('mathjs');
const Logger = require('js-logger');
const pckg = require('./../package.json');
const keybinding = require('./keybinding.json');
const Stack = require('./Stack');
const StackOps = require('./StackOps');
const loki   = require('lokijs');

const rgxpNum = /^[']?[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
const rgxpNumOps = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?([-+/*^a-zA-Z])$/;

// characters to avoid
const strangerThings = {
  '\u001b[A': 'up',
  '\u001b[B': 'down',
  '\u001b[D': 'left',
  '\u001b[C': 'right',
  '\u001b[1;2A': 'up',
  '\u001b[1;2B': 'down',
  '\u001b[1;2D': 'left',
  '\u001b[1;2C': 'right',
  '\u001a': 'ctr-z',
  '\r': 'return',
  '.': 'decimalPoint'
}


var db = null;
var stackLine = null;


class NoEq {

  constructor(options) {
    this.prompt = options.prompt ? options.prompt : '!= ';
    this.precision = options.precision ? parseInt(options.precision) : 10;
    this.logLevel = options.logLevel ? options.logLevel : 'OFF';
    this.switchKeypress = true;
    this.stack = [];
    this.tmp = [];
    this.switchKeypress = true;
    this.undo = 0;
    this.appDir = '.noeqRPNCjsCALC';
    this.db = new loki(`${homedir}${path.sep}${this.appDir}${path.sep}loki.js`,
      {
        autoload:true,
        autoloadCallback : this.lokiLoadHandler.bind(this),
        autosave:true,
        autosaveInterval: 5000
      });
  }

  on() {

    Logger.useDefaults();
    Logger.setLevel(Logger[this.logLevel]);

    math.config({
      number: 'BigNumber',
      precision: this.precision
    });

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${this.prompt}`,
      terminal: true,
      historySize: 0
    });

    this.stackCtrl = new Stack(rl, math, Logger, stackLine);
    let stackOps = new StackOps(rl, math, Logger);

    process.stdin.on('keypress', (s,key) => {

      if (key !== null ) {
        if (key.sequence == '\'') {
              this.switchKeypress = false;
        }
        // do not add to temp array no valid scape characters
        if (!strangerThings[key.sequence]) {
          this.tmp.push(key.sequence);
        } else {
          Logger.debug('not add');
        }
        // parsing stuff like "," as "." the real decimal symbol ;) for MacOSX users
        if (key.sequence === ',') {
          this.tmp = _.dropRight(this.tmp);
          this.tmp.push('.')
        }
        // removing any space
        if (key.sequence === ' ') {
          this.tmp = _.dropRight(this.tmp);
        }
        var str = this.stackCtrl.arrayToStr(this.tmp);
        // We get a new line return and the temp array has sometnig else than return
        if (key.name === 'return') {
          Logger.debug('RETURN');
          // cleaning the tmp array with strangerThings
          if (this.tmp.length > 0 && strangerThings[this.tmp[0]]) {
            this.tmp = []
          }
          if (this.tmp.length === 0 && this.stack.length > 0) {
            Logger.debug('void line');
            this.tmp = stackOps.last(this.stack);
          } else if (str != null && rgxpNum.test(str)) { // It is just a number to push at the stack
            Logger.debug(`The captured characters: ${str}`);
            if (str.indexOf('\'') === 0){
              this.tmp = _.drop(this.tmp);
              this.switchKeypress = true;
            }
            let num = this.stackCtrl.arrayToFloat(this.tmp); // parsing the temp array into Float
            Logger.debug(`The converted characters to num: ${num}`)
            if (!isNaN(num)) {
              this.stack.push(num);
              this.tmp = [];
            }
          } else {
            this.tmp = [];
          }
          this.stackCtrl.print(this.stack,true);
        } else {
          // is something to parse into a Float and one last symbol
          Logger.debug(`this.tmp.length: ${this.tmp.length}`);
          var cmd = this.tmp[this.tmp.length-1];
          Logger.debug(`cmd: ${cmd}`);

          if (str != null && rgxpNumOps.test(str) && cmd != 'e') {
            if (keybinding.keyPress[cmd] != null ) {
              Logger.debug(`this.tmp On command: ${this.tmp}`);
              let num = this.stackCtrl.arrayToFloat(_.dropRight(this.tmp)); // parsing the temp array into Float without the command
              if (!isNaN(num)) {
                this.stack.push(num);
                this.stack = this.stackCtrl.operation(keybinding.keyPress[cmd].numOp,keybinding.keyPress[cmd].operation,this.stack);
              }
            }
            this.stackCtrl.print(this.stack,true);
            for (var i = 0; i < this.tmp.length; i++) {
              Logger.debug(`this.tmp: ${this.tmp}`);
              rl.write(null,{name: 'delete'});
            }
            this.tmp = [];
          } else if (keybinding.keyPress[key.sequence] != null &&
                     this.switchKeypress &&
                     keybinding.keyPress[key.sequence].f != null
                      ) { // first stack stuff
                        this.stack = stackOps[keybinding.keyPress[key.sequence].f](this.stack);
                        this.stackCtrl.print(this.stack,true);
                        this.tmp = [];
          } else if (keybinding.keyPress[key.sequence] != null &&
                     this.switchKeypress &&
                     keybinding.keyPress[key.sequence].operation != null
                   ) { // this is a math operation
                       this.stack = this.stackCtrl.operation(keybinding.keyPress[key.sequence].numOp,keybinding.keyPress[key.sequence].operation,this.stack);
                       this.stackCtrl.print(this.stack,true);
                       this.tmp = [];
                       rl.write(null,{name: 'delete'});
          } else if (key.shift &&
                     keybinding.keyPress[key.sequence] != null &&
                     this.switchKeypress &&
                     keybinding.keyPress[key.sequence].shift &&
                     keybinding.keyPress[key.sequence].f != null
                   ) { // first stack stuff with shift key
                        this.stack = stackOps[keybinding.keyPress[key.sequence].f](this.stack);
                        this.stackCtrl.print(this.stack,true);
                        this.tmp = [];
          } else if (key.shift &&
                     keybinding.keyPress[key.sequence] != null &&
                     this.switchKeypress &&
                     keybinding.keyPress[key.sequence].shift &&
                     keybinding.keyPress[key.sequence].operation != null
                   ) { // this is a math operation with shift key
                       this.stack = this.stackCtrl.operation(keybinding.keyPress[key.sequence].numOp,keybinding.keyPress[key.sequence].operation,this.stack);
                       this.stackCtrl.print(this.stack,true);
                       this.tmp = [];
                       rl.write(null,{name: 'delete'});
          }
        }
      }
    });

    // Is a ctr-c Asking the user about saving the current stack for further use
    rl.on('SIGINT', () => {
      if (this.stack.length > 0) {
        rl.question('May I store the current stack? (will be available next time you\'ll open NoEq) ['.grey + 'y'.white + '\/n]: '.grey, (answer) => {
            if (answer.match(/^y(es)?$/i) || answer.match(/^$/i)) {
              this.save().then(()=> process.exit());
            } else if (answer.match(/^n(o)?$/i)) {
              this.truncate().then(()=> process.exit());
            }
        });
      } else {
        process.exit();
      }
    });


    // Is a ctr-z Will perform undo on the state of the stack
    rl.on('SIGTSTP', () => {
      if (this.stackLine.count() > 0 && this.stackLine.count() > this.undo) {
        this.stack = this.stackLine.get(this.stackLine.count() - this.undo++,true)[0].state.split(',');
        this.stackCtrl.print(this.stack,false);
      }
    });
  }

  createDefaultFolder() {
    try {
      if (!fs.existsSync(`${homedir}${path.sep}${this.appDir}`)){
        fs.mkdirSync(`${homedir}${path.sep}${this.appDir}`);
      }
    } catch (e) {
      Logger.debug(`e: ${e}`);
    }
  }

  lokiLoadHandler() {
    this.createDefaultFolder();
    this.stackLine = this.db.getCollection('stackLine');
    if (!this.stackLine) {
        this.stackLine = this.db.addCollection('stackLine');
    }
    this.stackCtrl.setStackLine(this.stackLine);
    if (this.stackLine.count() > 0) {
      this.stack = this.stackLine.get(this.stackLine.count(),true)[0].state.split(',');
    }
    this.stackCtrl.print(this.stack,true)
  }

  save() {
    return new Promise((resolve, reject) => {
      this.db.saveDatabase((error) => {
        if (error !== undefined && error !== null) {
          Logger.error(error);
        }
        resolve();
      });
    });
  }

  truncate() {
    this.stackLine.clear();
    return this.save();
  }
}

module.exports = NoEq;
