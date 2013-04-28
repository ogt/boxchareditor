Box drawing character utility
======================

[![Build Status](https://travis-ci.org/ogt/boxchareditor.png?branch=gh-pages)](https://travis-ci.org/ogt/boxchareditor)

## SYNOPSIS

Simple utility to make it easier to create lines, line charts, org charts using plain text characters.

## EXAMPLES

![Example](resources/example.gif "Pressing Shift, Command and ALt arrows draws single double lines or erases")

Here are some examples of what you can create:

              +--+                                                              
              |  |                                                              
              ++++                                                              
               ||                                                               
         +==+==++==+==+                                                         
         +==+      +==+                                                         
            |      |                                                            
            |      |                                                            
            +=+===++                                                            
            | +-+ |                                                             
            | | | |                                                             
            | | | |                                                             
            +-+ +-+                                                             


or

                                                                               
      +====+=============+===================+                                  
      |    |             |                   |                                  
      +----+-------------+-------------------+                                  
      |    |             |                   |                                  
      |    |             |                   |                                  
      |    |             |                   |                                  
      +====+=============+===================+                                  
                          
or
                                                                                                                                                              
                   +---------+                                                                                                                                  
                   |         |                                                                                                                                  
                   +----+----+                                                                                                                                  
                        |                                                                                                                                       
         +--------------+------------+                                                                                                                          
      +--+--+        +--+--+      +--+--+                                                                                                                       
      |     |        |     |      |     |                                                                                                                       
      +--+--+        +--+--+      +--+--+                                                                                                                       
         |   +----+     | +----+     | +----+                                                                                                                   
         +---+    |     +-+    |     +-+    |                                                                                                                   
         |   +----+     | +----+     | +----+                                                                                                                   
         |              |            |              
         |   +----+     | +----+     | +----+                                                                                                                   
         +---+    |     +-+    |     +-+    |                                                                                                                   
         |   +----+     | +----+     | +----+                                                                                                                   
         |              |            |              
         |   +----+     | +----+     | +----+                                                                                                                   
         +---+    |     +-+    |     +-+    |                                                                                                                   
             +----+       +----+       +----+                                                                                                                   
                                                    

## DESCRIPTION

To try it go to http://ogt.github.com/boxchareditor
and then use your keyboard arrows to move the yellow cursor around (you may need to click on it to give to the window focus).

When you want to draw a line, keep the `SHIFT` key pressed while you move the arrows.
The line will be using the `-` dash character to draw the line when moving horizontally and the  `|` bar character 
to draw vertical lines.  Keep the `SHIFT`  and `COMMAND` (for macs) or `META` (for pcs) keys pressed to draw a double line using the `=` equal character.

When a horizontal and a vertical line cross it uses the `+` plus character. 
There is no undo, but you can erase what you drew by pressing the `ALT` key while you move. Erasing is "smart", i.e., it looks
at its neighboring cells and fixes anything that need to be fixed after the erase.

Pressing the Restart button does the obvious. 
There are a few configuration variables that you can change - you will need to press Restart for them to take effect.
One of the configuration variables is `speed` - speed 2 means that a any arrow key pressed is repeated 2 times - so the 
moving/drawing happens faster.

The drawing happens against an invisible canvas - you control the width and height of it through configuration parameters.
You cannot draw outside the canvas. 
For fonts you shoud probably stick to fixed width fonts.

The purpose of the utility is to allow you to draw relative complex tables/org charts 
that you then copy and paste into your editor.

## INSTALLATION 

To run locally:

    > hub clone ogt/boxchareditor && cd boxchareditor
    > npm install
    > open index.html

To make local changes:

    > hub clone ogt/boxchareditor && cd boxchareditor
    > npm install
    > # make any changes you want
    > make bundle  #recreates static/bundle.js
    > make test # confirm tests run fine
    > open index.html

To recreate the man page (if you don't have ruby's `bundle` `gem instal bundle` first)

    > bundle install
    > make man

To get coverage report

    > make cover
    > open cover_html/index.html

To run lint based on the included `.jsinitrc` spec

    > make lint

To run the tap tests

    > make test # or just npm test

Its a good idea to run `make all` or just `make` before pushing to make sure that everything has been updated.
If you want an enhancement feel free to add an issue to github.com/ogt/boxchareditor

## SEE ALSO 

https://github.com/LearnBoost/cli-table, 
https://github.com/substack/node-multimeter, 
https://github.com/substack/picture-tube

## ACKNOWLEDGMENTS

- The animated gif was created using [keycastr](https://github.com/sdeken/keycastr/) , 
- Quicktime Player and an [online image converter](http://image.online-convert.com/convert-to-gif) following the advice of [github.com/f](https://github.com/f) @ [HN](https://news.ycombinator.com/item?id=5613652).

## COPYRIGHT

Odysseas Tsatalos, http://tsatalos.gr

## FILES

https://github.com/ogt/boxchareditor

