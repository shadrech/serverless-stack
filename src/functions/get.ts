import AWS from 'aws-sdk';
import { AWSLambdaHandler } from '../typings';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const get: AWSLambdaHandler = async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME || '',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: (event as any).pathParameters.id
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  const result = await dynamoDb.get(params).promise();

  if (!result.Item || result.$response.error) {
    const response = {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Not Found" })
    };
    return response;
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Item)
  };
};

export default get;
