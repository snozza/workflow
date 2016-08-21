const config = exports;
config.nodeEnv = process.env.NODE_ENV || 'development';
config.port = process.env.PORT,
config.workflowHost = process.env.WORKFLOW_HOST;
config.apiKey = process.env.API_KEY;
config.accountKey = process.env.ACCOUNT_KEY;
config.sessionSecret = process.env.ACCOUNT_KEY;

if (config.nodeEnv === 'development') {
  config.sessionSecret = 'secretSession';
  config.port = 3000;
}
