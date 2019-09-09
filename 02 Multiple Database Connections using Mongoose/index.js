const express = require('express');
const app = express();



const mongoose = require('mongoose');

//Default connections are created using .connect method
mongoose.connect('mongodb://localhost/mainDB', { useNewUrlParser: true })

//Default Models gets added to default connection
//Below schema is flexible schema which means all the properties of the objects gets saved into DB
const TODO = mongoose.model('todo', new mongoose.Schema({},{strict: false}))


//Now lets create new connection
//.creatConnection creates new db connection
const newConnObject = mongoose.createConnection('mongodb://localhost/anotherDB', { useNewUrlParser: true });

//Adding models to new  connection ->
//In order to add models to new new connection you must have object of new connection.
//(Here I have stored new connetion object in 'newConnObject')

//If you want to model to this object in other file either you can export this object or just use following code
//const mongoose = require('mongoose');
//const newConnObject = mongoose.connections[1];

//Now you are good to add models to this object which will be stored in another DB.
const anotherTODO = newConnObject.model('anotherTodo', new mongoose.Schema({title:String, description:String}));




app.get('/', async (request, response) => {

	let tempArray = [];
	
	//As this schema is flexible hence we can add anything in this DB
	let mainDBTODO = new TODO({
		title:'Buy a mobile', 
		description: "Buy Iphone X for brother's birthday", 
		birthDate: '01-01-2000'
	})

	//This object will be saved in 'mainDB' using default connection
	await mainDBTODO.save().then((data) => {
		tempArray.push(data);
		console.log(data);
	}).catch(()=> {
		tempArray.push('Something went wrong with mainDB');
	});

	//Here we can add only two properties 'title' and 'description'. Other properties will not be saved in DB.
	let anotherDBTODO = new anotherTODO({title:'Buy a ring', description:'Rakshabandhan'});

	//This object will be saved in 'anotherDB' using another connection
	await anotherDBTODO.save().then((data) => {
		tempArray.push(data);
		console.log(data);
	}).catch(()=> {
		tempArray.push('Something went wrong with anotherDB');
	});

	response.send({tempArray});
})


app.listen(3000, ()=>{
	console.log("App is runnig on port 3000");
})