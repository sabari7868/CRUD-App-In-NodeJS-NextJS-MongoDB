let mongoose = require('mongoose');

// Replace <port> with the port number your MongoDB container is listening on (default is 27017)
let MONGO_URI = 'mongodb://localhost:27018/CRUD';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
