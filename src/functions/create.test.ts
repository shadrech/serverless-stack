const dynamoPutMock = jest.fn().mockReturnValue({
  promise: jest.fn()
});

import uuid from 'uuid';
import create from './create';

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: "cognitoIdentityId"
    }
  },
  body: {
    content: "content",
    attachment: "attachment"
  }
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: dynamoPutMock
    }))
}}));

describe('Function - create()', () => {

  let oldEnv: any;

  beforeAll(() => {
    oldEnv = process.env;
    process.env = {
      TABLE_NAME: "TABLE_NAME"
    };
    jest.spyOn(uuid, "v1").mockReturnValue("UUID");
    jest.spyOn(global.Date, "now").mockImplementation(() => 12345);
  })

  afterAll(() => {
    process.env = oldEnv
  })

  it('calls Dynamo sdk with correct params', async () => {
    const response = await (create as any)(mockEvent, null, null);
    expect(dynamoPutMock).toHaveBeenCalledWith({
      TableName: 'TABLE_NAME',
      Item: {
        userId: 'cognitoIdentityId',
        noteId: 'UUID',
        content: 'content',
        attachment: 'attachment',
        createdAt: 12345
      }
    });
    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        userId: 'cognitoIdentityId',
        noteId: 'UUID',
        content: 'content',
        attachment: 'attachment',
        createdAt: 12345
      })
    });
  })

})
