import AWS from 'aws-sdk';
import { AWSLambdaHandler } from '../typings';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const list: AWSLambdaHandler = async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME || '',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  const result = await dynamoDb.query(params).promise();

  if (!result.Items || result.$response.error) {
    const response = {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({ error: "Not Found" })
    };
    return response;
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items)
  };
};

export default list;
