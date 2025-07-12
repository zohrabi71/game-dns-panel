require('express-async-errors');
const express = require('express');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./startup/db')()
require('./startup/error')()
require('./startup/config')(app, express)

app.use((req, res, next) => {
   res.locals = { errors: req.flash('errors'), req };
   next();
})

app.use('/', require('./routes/home'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log('Your Server is running on port 3000.');
})