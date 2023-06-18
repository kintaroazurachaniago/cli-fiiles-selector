This package can make you choose multiple files from command line interface easily just using Arrow (UP, RIGHT, DOWN, LEFT) key for navigation, SPACE key for select or unselect item, ENTER key for returning selected files, and ESC key for cancel selection.

# Usage
### Require cfs module
```javascript
const cfs = require('cli-files-selector')
```
### Create interface (optional)
```javascript
const interfaceObject = {
	cursorPosition : -1,				/* starter cursor position */
	cursorSign     : '<-',			/* cursor sign will be showed */
	width          : 30, 				/* selector area width */
	error          : undefined,	/* show error directly when it started */
	message        : 'Welcome', /* flash message for action status */
	path           : base,			/* where to selecting files */
	parentCursor   : [],				/* let it empty */
	data           : [],				/* direct data to be selected */
	selected       : []					/* selected files collection */
}
```
### Selecting files interface
```javascript
cfs.select().then( selected => {
	console.log(selected)
})
```

# KINTARO XD

Just contact me if you have a question wa.me/6289633948126?text=What+is+cli+files+selector