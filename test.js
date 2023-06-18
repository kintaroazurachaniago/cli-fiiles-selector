const fs = require('fs')
const cfs = require('./index.js')

async function selectFiles () {
  const selected = await cfs.select()
  console.log('Selected files', selected)
  const first = selected.shift()
  const file = fs.readFileSync(first, 'utf8')
  console.log('File:', file)
  return selected
}

console.log('selecting files')
selectFiles().then( res => {
  console.log('selecting finished', res)
})