"use strict";

const keybinding = require('./../../src/keybinding.json');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

var write = (line) => {
  fs.appendFile(path.join(__dirname,'./../../README.md'),line, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

write('\n## Keymap:\n\n');

_.map(keybinding.keyPress,(value,key)=>{
  if (value.operation) {
    write(`* **${key}**: [${value.operation}](http://mathjs.org/docs/reference/functions/${value.operation}.html)\n`);
  } else {
    write(`* **${value.keyName}**: '${value.f}' ${value.description}\n`);
  }
});
