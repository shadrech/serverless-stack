export const bodyJson: AWSLambda.Handler = async (event, _context) => {
  console.log('ZE MIDDLE--->', event.body);
  event.body = JSON.parse(event.body);
  return event;
}
