interface APIGatewayEvent<IBody = null> extends Omit<AWSLambda.APIGatewayEvent, 'body'> {
  body: IBody;
}

export type AWSLambdaHandler<IBody = {}> = AWSLambda.Handler<APIGatewayEvent<IBody>>;