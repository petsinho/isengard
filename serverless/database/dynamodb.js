

const Promise = require('bluebird');
const AWS = require('aws-sdk');

let dynamodbOfflineOptions = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  },
  isOffline = () => process.env.IS_OFFLINE;

const client = isOffline() ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions) : new AWS.DynamoDB.DocumentClient();

module.exports = (method, params) => {
  return Promise.fromCallback(cb => client[method](params, cb));
};
