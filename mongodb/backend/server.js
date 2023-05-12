const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE;
// console.log(DB);

mongoose
  .connect(DB)
  .then(con => console.log('DB connction established'))
  .catch(err => console.log(err));

const port = process.env.PORT;
const host = process.env.LOCALHOST;
app.listen(port, host, () => {
  console.log(`listening host ${host}/${port}...`);
});
