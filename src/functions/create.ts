import uuid from 'uuid';
import AWS from 'aws-sdk';
import { AWSLambdaHandler } from '../typings';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface Body {
  content: string;
  attachment: string;
}

const create: AWSLambdaHandler<Body> = async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME || '',
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: event.body.content,
      attachment: event.body.attachment,
      createdAt: Date.now()
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: error
    };
  }
  
};

export default create;
