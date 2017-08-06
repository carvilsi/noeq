# != NoEq

!= a <3 [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) calculator using [math.js](http://mathjs.org/)

![Alt vmware](https://github.com/carvilsi/noeq/raw/master/img/noeq.png)


On top of math.js a powerful and extensible and easily customize RPN calculator UX oriented.

Due the current Keymap, any operation will be executed after pressing the key, with the arguments on the stack or inline with the last one. Thus you not need to press enter to execute operation.

The decimal point is Mac OS X friendly, you can use "." or ",", so you can use the Bloq Num of your keyboard.

You ca use the cursors to perform stack manipulation.

Sadly if you want to put a negative number on the stack or operate you need to scape the '-' symbol like:

`!= '-0.5`

The name "NoEq" is a small tribute to those great HP's RPN calculators and his [No Equals](https://en.wikipedia.org/wiki/Reverse_Polish_notation#Hewlett-Packard) stuff.


## Install and Run

  `$ npm install noeq -g`

  `$ noeq`

  Usage: noeq [options]

  Options:

    -V, --version           output the version number
    -p, --prompt [type]     Your prompt for NoEq, default: !=
    -s, --precision [type]  precision for mathjs library value [0..16], default: 10 (http://mathjs.org/docs/reference/functions/format.html)
    -l, --logLevel [type]   level for logging (dev porpouses), default: OFF
    -h, --help              output usage information

## Keymap:

* **ctr-c**: 'exit' Stops NoEq and prompt asking if the current stack must be persisted on a file for further use on the next session.

### Stack manipulation

* **up**: 'reverse' Performs a reverse operation over the stack elements
* **left**: 'drop' Deletes the first element on the stack
* **right**: 'swap' Swaps the two first elements on the stack
* **down**: 'first' Swaps position of the first and last elements on the stack
* **ctr-z**: 'undo' Performs an undo over the stack, return it to the previous state


### Math functions

* **+**: [add](http://mathjs.org/docs/reference/functions/add.html)
* **/**: [divide](http://mathjs.org/docs/reference/functions/divide.html)
* **-**: [subtract](http://mathjs.org/docs/reference/functions/subtract.html)
* **\***: [multiply](http://mathjs.org/docs/reference/functions/multiply.html)
* **p**: [pow](http://mathjs.org/docs/reference/functions/pow.html)
* **c**: [cos](http://mathjs.org/docs/reference/functions/cos.html)
* **C**: [sec](http://mathjs.org/docs/reference/functions/sec.html)
* **s**: [sin](http://mathjs.org/docs/reference/functions/sin.html)
* **S**: [csc](http://mathjs.org/docs/reference/functions/csc.html)
* **t**: [tan](http://mathjs.org/docs/reference/functions/tan.html)
* **T**: [cot](http://mathjs.org/docs/reference/functions/cot.html)
* **r**: [sqrt](http://mathjs.org/docs/reference/functions/sqrt.html)
