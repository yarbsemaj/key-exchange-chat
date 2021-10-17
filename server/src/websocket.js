exports.handler = async function (event, context) {
  console.log(JSON.stringify(event, null, 2));

  const { body, requestContext: { connectionId, routeKey } } = event;
  switch (routeKey) {
    case '$connect':
    case '$disconnect':
      break;
  }
  return { statusCode: 200 };
}
