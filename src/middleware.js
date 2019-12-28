export const bodyParser = async event => {
  event.body = JSON.parse(event.body || '{}');
}
