/**
 * @file Server listening service
 */
import app from './app';

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
  console.log('Login server listening on port ' + port);
});