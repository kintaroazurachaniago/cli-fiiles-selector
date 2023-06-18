const path = require('path')

module.exports = function (args) {

  console.clear()
  console.log(args.path)

  const cursorPosition = args.cursorPosition ?? 0
  const cursorSign     = args.cursorSign ?? '<-'
  const data           = args.data ?? []
  const selected       = args.selected
  const error          = args.error
  
  if ( !data.length ) return console.log('Warning: Data empty')
  
  const max = data.map( d => d.length ).reduce( (a, c) => Math.max(a, c), Number.MIN_SAFE_INTEGER )
  const width = args.width ?? max

  data.forEach( (d, i) => {
    const dPath    = path.join(args.path, d)
    const dimmed   = selected.includes(dPath) ? d.colorize('dim') : d
    const brighten = cursorPosition === i ? dimmed.colorize('bright') : dimmed
    const isError  = error == d ? d.colorize('r') : brighten
    process.stdout.write(isError)
    if ( cursorPosition !== i ) return process.stdout.write('\r\n')
    for ( let x = d.length-1; x < width; x++ ) process.stdout.write(' ') /* Write space between list and cursor */
    process.stdout.write(cursorSign + '\r\n')
  })

  rows = process.stdout.rows

  for ( let x = data.length + selected.length; x < rows - 3; x++ ) console.log()
  
  const message = args.message ?? 'Selected'
  if ( message.length > width ) return process.stdout.write(`-- ${message} --`)
  for ( let x = 0; x < width; x++ ) process.stdout.write(x == 2 ? ' ' + message + ' ' : '-')
  console.log()
  selected.forEach( s => console.log(s) )

}