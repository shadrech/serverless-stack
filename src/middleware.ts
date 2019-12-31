export const bodyParser: AWSLambda.Handler = async event => {
  event.body = JSON.parse(event.body || '{}');
}
