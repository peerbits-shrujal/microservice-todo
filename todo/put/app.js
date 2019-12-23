const AWS = require('aws-sdk');

let response;

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

let dbPut = params => {
  return dynamo.put(params).promise();
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    let item = {
      id: event.pathParameters.id,
      ...body
    };

    let params = {
      TableName: tableName,
      Item: item
    };

    await dbPut(params);
    response = {
      statusCode: 200,
      body: JSON.stringify({ data: item })
    };
  } catch (error) {
    response = {
      statusCode: 500,
      body: JSON.stringify({ error })
    };
  }

  return response;
};
