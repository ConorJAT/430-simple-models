// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');
const { Cat } = models;
const { Dog } = models;

const hostIndex = async (req, res) => {
  let name = 'unknown';

  try {
    const doc = await Cat.findOne({}).sort({'createdDate': 'descending'}).lean().exec();

    if(doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page'
  });
};

const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', {cats: docs});
  } catch (err) {
    console.log(err);
    return res.render('page1');
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = async (req, res) => {
  try {
    const doc = await Cat.findOne({}).sort({'createdDate': 'descending'}).lean().exec();

    if(!doc) {
      return res.status(404).json({error: 'No cat found.'});
    }

    return res.json({name: doc.name});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong connecting to database.'});
  }
};

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }
  
  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();
    return res.status(201).json({
      name: newCat.name,
      beds: newCat.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create cat.'});
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOne({name: req.query.name}).select('name bedsOwned').exec();

    if (!doc){
      return res.status(404).json({ error: `No cat found with the name ${req.query.name}.`});
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong connecting to database.'});
  }
};

const updateLast = async (req, res) => {
	try {
    const doc = await Cat.findOneAndUpdate({}, {$inc: {bedsOwned: 1}}, {returnDocument: 'after', sort: {'createdDate': 'descending'}}).lean().exec();

    return res.json({name: doc.name, beds: doc.bedsOwned});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong connecting to database.'});
  }
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};


// -- FUNCTIONS ADDED FOR MVC MODELS ASSIGNMENT --
const createDog = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'FirstName, LastName, Breed and Age are all required.' });
  }
  
  const dogData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
    return res.status(201).json({
      name: newDog.name,
      breed: newDog.breed,
      age: newDog.age,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create dog.'});
  }
};

const editDog = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required to perform incrementation.' });
  }

  try {
    const doc = await Dog.findOneAndUpdate({name: req.body.name}, {$inc: {age: 1}}, {returnDocument: 'after'}).lean().exec();

    if (!doc){
      return res.status(404).json({ error: `No dog found with the name ${req.body.name}.`});
    }

    return res.json({ name: doc.name, breed: doc.breed, age: doc.age});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong connecting to database.'});
  }
};

const hostPage4 = async (req, res) => {
  try {
    const docs = await Dog.find({}).lean().exec();
    return res.render('page4', {dogs: docs});
  } catch (err) {
    console.log(err);
    return res.render('page4');
  }
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
  createDog,
  editDog,
  page4: hostPage4,
};
