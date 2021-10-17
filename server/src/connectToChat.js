const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const chatTable = process.env.CHAT_TABLE;

const broadcast = require('./libs/broadcast')


exports.handler = async function (event, context) {
  // For debug purposes only.
  // You should not log any sensitive information in production.
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { body, requestContext: { connectionId, routeKey } } = event;
  let parsedBody = body ? JSON.parse(body).data : undefined;
  let chatID = parsedBody.chatID;
  let joinedChat = (await dynamodb.update({
    TableName: chatTable,
    Key: {
      chatID
    },
    UpdateExpression: "SET participants = list_append(participants, :participants), #ttl = :ttl ",
    ConditionExpression: "size(participants) <= :num",
    ExpressionAttributeValues: {
      ":num": 1,
      ":ttl": parseInt((Date.now() / 1000) + 3600),
      ":participants": [{ connectionId, publicKey: parsedBody.publicKey }]
    },
    ExpressionAttributeNames: {
      "#ttl": 'ttl',
    },
    ReturnValues: "ALL_NEW"
  }).promise()).Attributes;
  await broadcast(joinedChat.participants, joinedChat, 'join-chat');
  return { statusCode: 200 };
}
