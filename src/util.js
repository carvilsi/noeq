const helpMessage = `
               __                              
              |  |         _____     _____     
              |  |_____   |   | |___|   __|___ 
              |__|_____|  | | | | . |   __| . |
              |__|_____|  |_|___|___|_____|_  |
                                            |_|
 
 Keymap

      ctr-c: 'exit' Stops NoEq and prompt asking if the current stack must be persisted on a file for further use on the next session.
      h: prints help into the stack

  Stack manipulation

      up: 'reverse' Performs a reverse operation over the stack elements
      left: 'drop' Deletes the first element on the stack
      right: 'swap' Swaps the two first elements on the stack
      down: 'first' Swaps position of the first and last elements on the stack
      ctr-z: 'undo' Performs an undo over the stack, return it to the previous state

  Math functions

      +: add    -: subtract    /: divide    *: multiply
      p: pow    c: cos         C: sec       s: sin
      S: csc    t: tan         T: cot       r: sqrt`;

