import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('four-oh-four', { path: '/missing' });
  this.route('maintenance');
  this.route('dashboard', { path: '/' }, function () {
    this.route('location', { path: '/:location_id' });
  });
});
