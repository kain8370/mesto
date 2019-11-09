const express = require('express');
const path = require('path');
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');
const routerError = require('./routes/error');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routerCards);
app.use('/', routerUsers);
app.use('/', routerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
