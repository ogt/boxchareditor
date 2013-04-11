Box drawing character utility:

Simple utility to make it easier to create lines, line charts, org charts using plain text characters.

                                                                        
              +--+                                                              
              |  |                                                              
              ++++                                                              
               ||                                                               
         +--+--++--+--+                                                         
         +--+      +--+                                                         
            |      |                                                            
            |      |                                                            
            +-+---++                                                            
            | +-+ |                                                             
            | | | |                                                             
            | | | |                                                             
            +-+ +-+                                                             
                      
To try it go to http://ogt.github.com/boxchareditor
and then use your keyboard arrows to move the yellow cursor around.
When you want to draw a line, keep the SHIFT key pressed while you move the arrows.
The line will be using the `-` dash character to draw the l when moving horizontally and the  `|` bar character 
to draw vertical lines. 

When a horizontal and a vertical line cross it uses the `+` plus character. 
There is no undo, but you can erase what you drew by pressing the ALT key while you move.

Pressing the Restart button does the obvious. 
There are a few configuration variables that you can change - you will need to press Restart for them to take effect.
One of the configuration variables is `speed` - speed 2 means that a any arrow key pressed is repeated 2 times - so the 
moving/drawing happens faster.

The drawing happens against an invisible canvas - you control the width and height of it through configuration parameters.
You cannot draw outside the canvas. 
For fonts you shoud probably stick to fixed width fonts.

The purpose of the utility is to allow you to draw relative complex tables/org charts 
that you then copy and paste into your editor.

If you want an enhancement feel free to add an issue.
