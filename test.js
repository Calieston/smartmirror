 var jsonfile = require('jsonfile')
var file = 'speach.json'
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj.result['0'].alternative['0'].transcript)
})

