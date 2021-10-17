const AWS = require('aws-sdk');
const broadcast = require('./libs/broadcast')

const dynamodb = new AWS.DynamoDB.DocumentClient();

const chatTable = process.env.CHAT_TABLE;

exports.handler = async function (event, context) {
  // For debug purposes only.
  // You should not log any sensitive information in production.
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { body, requestContext: { connectionId, routeKey } } = event;
  let parsedBody = body ? JSON.parse(body).data : undefined;
  console.log(parsedBody)
  let chatID = parsedBody.chatID;
  let chat = (await dynamodb.update({
    TableName: chatTable,
    Key: {
      chatID
    },
    UpdateExpression: "SET #ttl = :ttl ",
    ExpressionAttributeValues: {
      ":ttl": parseInt((Date.now() / 1000) + 3600),
    },
    ExpressionAttributeNames: {
      "#ttl": 'ttl',
    },
    ReturnValues: "ALL_NEW"
  }).promise()).Attributes;
  await broadcast(chat.participants.filter((participant) => participant.connectionId != connectionId), parsedBody.message, parsedBody.type)
  return { statusCode: 200 };
}
