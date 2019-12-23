const AWS = require('aws-sdk');

let response;

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

let dbGet = params => {
  return dynamo.get(params).promise();
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
    let params = {
      TableName: tableName,
      Key: {
        id: event.pathParameters.id
      }
    };

    const data = await dbGet(params);

    if (!data.Item) {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          message: 'ITEM NOT FOUND'
        })
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify({ data: data.Item })
      };
    }
  } catch (err) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      })
    };
  }

  return response;
};
