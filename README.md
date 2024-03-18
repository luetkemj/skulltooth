Skulltooth

[play](https://luetkemj.github.io/skulltooth/)


- [x] setup
- [x] engine
- [x] loop
- [x] @
- [ ] maps
- [ ] FOV 
- [ ] pathfinding
- [ ] monsters
- [ ] combat
- [ ] items
- [ ] GUI
- [ ] saving

NOTES:

Going to try not using events and instead use functions within systems. Systems have access the entire world and game state so I should be able to run event like functions with entity inputs. components can have function names to replicate inversion of control. For example: 

Brain component can have a goals array that contains a list of goal functions. The brain system knows to look at the goal names and how to use them to call the goal functions. These will have a standard contract of args so it's reacting to them should be fairly simple. We'll see I guess.


// fireEvent('tryMove', '123', {a: 1})

// function fireEvent(name, eid, payload) {
//     const entity = getEntity(eId)

//     // loop over all components on entity
//     // call tryMove with each component, check if component supports the tryMove event
//     // if so, run the function with the payload and do the thing.
// }


