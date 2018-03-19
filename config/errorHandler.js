/**
 * Set up the Express error handlers.
 * Created by mspalti on 6/1/16.
 */

'use strict';

module.exports = function (app) {

  var env = app.get('env');

  /**
   *  Catch 404 and forward to error handler. Any request
   *  not handled by express or routes configuration will
   *  invoke this middleware.
   */
  app.use(function (req, res, next) {
    var err = new Error('Not Found: ' + req.originalUrl);
    err.status = 404;
    err.request = req.originalUrl;
    next(err);
  });

  /**
   * Handle xhr client errors.
   * @param err
   * @param req
   * @param res
   * @param next
   */
  app.use(function (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({message: 'DSpace request failed', error: err});
    } else {
      next(err);
    }
  });

  /**
   * Development error handler will print a stacktrace.
   */
  /* jshint unused:false   */
  function developmentErrorHandler(err, req, res, next) {
    if (err !== null) {
      console.log(err);
    }
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      status: err.status
    });
  }

  /**
   * Production error handler with no stacktraces leaked to the user.
   */
  /* jshint unused:false   */
  function productionErrorHandler(err, req, res, next) {
    if (err !== null) {
      console.log(err);
    }
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      status: err.status
    });
    res.end();
  }

  /**
   * Set error handlers for production and development environments.
   */
  if ('production' === env) {
    app.use(productionErrorHandler);

  }
  else if ('development' === env || 'test' === env) {
    app.use(developmentErrorHandler);

  }

};
