const AWS = require('aws-sdk');

let response;

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

let dbDelete = params => {
  return dynamo.delete(params).promise();
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
      },
      ReturnValues: 'ALL_OLD'
    };
    console.log(params);

    const item = await dbDelete(params);

    if (!item.Attributes) {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          message: 'ITEM NOT FOUND FOR DELETION'
        })
      };
    } else {
      response = {
        statusCode: 204
      };
    }
  } catch (error) {
    response = {
      statusCode: 500,
      body: JSON.stringify({ error })
    };
  }

  return response;
};
