const readline = require('readline')
const fs = require('fs')
const events = require('events')
const path = require('path')
const base = path.resolve()

const print_cursor = require(path.join(base, 'functions/print-cursor'))
const emitter = new events.EventEmitter()

String.prototype.colorize = function (c) {
	const colors = {
		reset: '\x1b[0m', bright: '\x1b[1m', dim: '\x1b[2m', underscore: '\x1b[4m', blink: '\x1b[5m', reverse: '\x1b[7m', hidden: '\x1b[8m',
		black: '\x1b[30m', r: '\x1b[31m', g: '\x1b[32m', b: '\x1b[34m', y: '\x1b[33m', m: '\x1b[35m', c: '\x1b[36m', w: '\x1b[37m',
		bgBlack: '\x1b[40m', bgr: '\x1b[41m', bgg: '\x1b[42m', bgb: '\x1b[44m', bgy: '\x1b[43m', bgm: '\x1b[45m', bgc: '\x1b[46m', bgw: '\x1b[47m'
	}
	return !colors[c] ? this : colors[c] + this + colors.reset
}

function UP (data) {
    interfaceObject.cursorPosition--
    if ( interfaceObject.cursorPosition < 0 ) interfaceObject.cursorPosition = interfaceObject.cursorPosition == -2 ? 0 : data.length-1
}

function DOWN (data) {
    interfaceObject.cursorPosition++
    if ( interfaceObject.cursorPosition == data.length ) interfaceObject.cursorPosition = 0
}

function RIGHT (subPath) {
    const targetPath = path.join(interfaceObject.path, subPath)
    const isFile = fs.lstatSync(targetPath).isFile()
    
    if ( isFile ) {
        interfaceObject.error = subPath
        return interfaceObject.message = 'Cannot open file ' + subPath
    }
    
    interfaceObject.path = targetPath
    interfaceObject.parentCursor.push(interfaceObject.cursorPosition)
    interfaceObject.cursorPosition = 0
    interfaceObject.data = fs.readdirSync(interfaceObject.path)
}

function LEFT () {
    interfaceObject.cursorPosition = interfaceObject.parentCursor.pop() ?? 0
    interfaceObject.path = interfaceObject.path.split('\\').slice(0, -1).join('\\')
    interfaceObject.data = fs.readdirSync(interfaceObject.path)
}

function SPACE (hover) {
    const hoverPath = path.join(interfaceObject.path, hover)
    if ( !interfaceObject.selected.includes(hoverPath) ) return interfaceObject.selected.push(hoverPath)
    interfaceObject.selected = interfaceObject.selected.filter( s => s != hoverPath )
}

function RETURN () {
    process.stdin.setRawMode(false)
    emitter.emit('finished')
}


const interfaceObject = {
    cursorPosition : -1,
    cursorSign     : '<-',
    width          : undefined,
    error          : undefined,
    message        : undefined,
    path           : base,
    parentCursor   : [],
    data           : [],
    selected       : []
}

function createInterface (data) { for ( let [key, val] of Object.entries(data) ) interfaceObject[key] = val }

function select () {
    return new Promise( resolve => {
        if ( !interfaceObject.data.length ) {
            if ( !interfaceObject.path ) return resolve('Empty choices!')
            interfaceObject.data = fs.readdirSync(interfaceObject.path)
        }

const helper = `
UP    : move cursor up
DOWN  : move cursor down
RIGHT : enter sub dir
LEFT  : back to parent dir
SPACE : select item
ENTER : return
`
console.log(helper)
        
        readline.emitKeypressEvents(process.stdin)

        process.stdin.setRawMode(true)
                
        process.stdin.on('keypress', (char, key) => {
            
            /* exit program if escape key pressed */
            if ( key.name == 'escape' ) return process.exit()
            
            data = fs.readdirSync(interfaceObject.path)
            const hover = data[interfaceObject.cursorPosition]

            switch ( key.name ) {
                case 'up': UP(data); break
                case 'down': DOWN(data); break
                case 'right': RIGHT(hover); break
                case 'left': LEFT(); break
                case 'space': SPACE(hover); break
                case 'return': RETURN(); break
            }

            print_cursor(interfaceObject)

            interfaceObject.error = undefined
            interfaceObject.message = 'Selected'
        })

        emitter.once('finished', _ => {
            resolve(interfaceObject.selected)
        })
    })
}

module.exports = {
    createInterface,
    select
}