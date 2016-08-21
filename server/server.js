import { } from 'dotenv/config';

import Express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import config from '../config';

import jobRouter from './jobs/routes';

const app = new Express();


app.set('views', path.join(__dirname, '../views'));
app.engine('.hbs', handlebars({
  defaultLayout: path.join(__dirname, '../views/layouts/main'),
  extname: '.hbs',
  partialsDir: path.join(__dirname, '../views/partials'),
}));
app.set('view engine', '.hbs');
app.use(session({
  name: 'workflowSession',
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: false,
  rolling: true,
  httpOnly: true,
  cookie: {
    maxAge: 3600000 * 24
  }
}));
app.use(compression());
app.use(bodyParser.json());
app.use(Express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(jobRouter);

app.listen(config.port, () => {
  console.log('server is listening');
});
