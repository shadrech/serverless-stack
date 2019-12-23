import uuid from 'uuid';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface Event extends Omit<AWSLambda.APIGatewayEvent, 'body'> {
  body: {
    content: string;
    attachment: string;
  }
}

const create: AWSLambda.Handler<Event> = async (event) => {
  console.log('BODY--->', event.body.attachment);
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
  dynamoDb.put(params, (error, _data) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    if (error) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(params.Item)
      };
    }
  })
  return {
    message: 'Go Serverless! Your function executed successfully!',
    input: event,
  };
};

export default create;
