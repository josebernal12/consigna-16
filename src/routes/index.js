const util = require('util')
const router = require('express').Router();
const passport = require('passport');
const logger = require('../utils/logger')
const compression = require('compression')
const { fork } = require('child_process')
router.use(compression())

router.get('/signup', (req, res, next) => {
  logger.info(' signup get')

  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup',
logger.info(' signup post'),
{

  successRedirect: '/signin',
  failureRedirect: '/failuser',
  failureFlash: true
}));

router.get('/signin', (req, res, next) => {
  logger.info('signin get')
  res.render('signin');

});


router.post('/signin', passport.authenticate('local-signin',
  logger.info(' signin, post'),

  {
    successRedirect: '/profile',
    failureRedirect: '/faillogin',
    failureFlash: true
  }));

router.get('/profile', isAuthenticated, (req, res, next) => {
  logger.info('profile get')

  res.render('profile');
});
router.get('/failuser', (req, res) => {
  logger.warn('failuser get')

  res.render('errorUser')
})
router.get('/faillogin', (req, res) => {
  logger.warn('failogin get')
  res.render('errorLogin')
})
router.get('/logout', (req, res, next) => {
  logger.info('logout get')

  req.logout();
  res.redirect('/signin');
});

//RUTAS NUEVAS
router.get('/info', (req, res) => {
  logger.info('info get')

  res.json(`
  Version de Node ${process.version}
  Path de ejecucion ${process.cwd()}
  IdProcess ${process.pid}
  Nombre de la Plataforma ${process.platform}
  Carpeta ${process.title}
  path ${process.execPath}
  Uso de la Memoria ${util.inspect(process.memoryUsage(), {
    showHidden: false,
    depth: null,
    colors: true
  })}  
   `)

})
router.get('/info2', compression, (req, res) => {

  res.json(`
  Version de Node ${process.version}
  Path de ejecucion ${process.cwd()}
  IdProcess ${process.pid}
  Nombre de la Plataforma ${process.platform}
  Carpeta ${process.title}
  path ${process.execPath}
  Uso de la Memoria ${util.inspect(process.memoryUsage(), {
    showHidden: false,
    depth: null,
    colors: true
  })}  
   `)

})



router.get('/api/randoms', (req, res) => {
  logger.info('randoms get')

  try {
    let cant = req.query.cant;

    if (!cant) {
      cant = 1e8
    }

    const forked = fork('src/api/numberRandom.js');

    forked.on('message', (result) => {
      if (result === 'enviado') {
        forked.send(cant);
      } else {

        res.status(200).json({ resultado: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
})




function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/signin')
}

module.exports = router;