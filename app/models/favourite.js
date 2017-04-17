var mongoose=require('mongoose')
var ExampleSchema=require('../schemas/example.js')
var Example=mongoose.model('Example',ExampleSchema)

module.exports=Example