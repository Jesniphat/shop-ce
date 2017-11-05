import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

// Import Routes
const menu = require('./routes/menu');
const home = require('./routes/home');
const authen = require('./routes/authen');
const category = require('./routes/category');
const product = require('./routes/product');
const upload = require('./routes/upload');
const staff = require('./routes/staff');
const user = require('./routes/users');

// Express server
const app = express();

const PORT = process.env.PORT || 8100;
const DIST_FOLDER = join(process.cwd(), 'dist');

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
// console.log(join(DIST_FOLDER, 'browser'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/menu', menu);
app.use('/api/authen', authen);
app.use('/api/home', home);
app.use('/api/category', category);
app.use('/api/product', product);
app.use('/api/upload', upload);
app.use('/api/staff', staff);
app.use('/api/user', user);

// Server static files from /browser
app.get('*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
