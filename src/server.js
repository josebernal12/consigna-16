require('dotenv').config()
const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const controllersdb = require('./database/database')
const argv = require('./config/yargs')
const logger = require('./utils/logger')



const app = express();
require('./passport/passport');
        


app.set('views', path.join(__dirname, './views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'./views')))



app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'SecretJose',
  resave: false,
  saveUninitialized: false,
  rolling:true
  

}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.user = req.user;
    next();
});


app.use('/', require('./routes/index'));

app.use((req,res) =>{
   logger.error('pagina inexistente')
 res.render('failpage')
 })


controllersdb.conectarDB(process.env.URL, (err) => {
  if (err) return console.log("error en conexión de base de datos", err);
  console.log("BASE DE DATOS CONECTADA");
})

app.listen(argv.p, (error) => {
  if (error) {
      console.log(error)
  } else {
      console.log(`Servidor escuchando puerto: ${argv.p}`)
  }

});

