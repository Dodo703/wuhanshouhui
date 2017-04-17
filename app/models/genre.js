var mongoose=require('mongoose')
var GenreSchema=require('../schemas/genre.js')
var Genre=mongoose.model('Genre',GenreSchema)

module.exports=Genre