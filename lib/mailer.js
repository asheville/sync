var logger = require('./logger');
var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');
var stubTransport = require('nodemailer-stub-transport');

var mailer = {
  transport: nodemailer.createTransport(sendGridTransport({
    auth: {
      api_key: process.env.SYNC_SENDGRID_API_KEY
    }
  })),
  stubTransport: nodemailer.createTransport(stubTransport())
};

mailer.sendMail = function(email, callback) {
  try {
    if (!process.env.SYNC_SENDGRID_API_KEY) {
      throw new Error('Mailer failed to find SendGrid API key variable in environment');
    }

    if (!process.env.SYNC_NAME) {
      throw new Error('Mailer failed to find app name variable in environment');
    }

    if (!process.env.SYNC_MAILER_SENDER_EMAIL) {
      throw new Error('Mailer failed to find sender email variable in environment');
    }

    email.from = process.env.SYNC_NAME + '<' + process.env.SYNC_MAILER_SENDER_EMAIL + '>';

    if (logger.info) {
      logger.info('Mailer sending email in ' + process.env.NODE_ENV + ' environment', { email: email });
    }

    if (process.env.NODE_ENV === 'production' || (process.env.NODE_ENV === 'development' && email.to === process.env.SYNC_MAILER_DEV_RECIPIENT_EMAIL)) {
      this.transport.sendMail(email, callback);
    } else {
      this.stubTransport.sendMail(email, callback);
    }
  } catch (error) {
    if (logger.error) {
      logger.error(error.message, { email: email });
    }

    callback(error);
  }
}

mailer.isValidEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = mailer;