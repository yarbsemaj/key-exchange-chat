const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const chatTable = process.env.CHAT_TABLE;

const broadcast = require('./libs/broadcast')

exports.handler = async function (event, context) {
  // For debug purposes only.
  // You should not log any sensitive information in production.
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { body, requestContext: { connectionId } } = event;
  let parsedBody = body ? JSON.parse(body).data : undefined;
  console.log(parsedBody)
  let chatID = Math.random().toString(36).substring(2, 12);
  let newChat = await dynamodb.put({
    TableName: chatTable,
    Item: {
      chatID,
      participants: [{ connectionId, publicKey: parsedBody.publicKey }],
      ttl: parseInt((Date.now() / 1000) + 3600)
    }
  }).promise();
  let response = {
    chatID,
    participants: [{ connectionId, publicKey: parsedBody.publicKey }],
    ttl: parseInt((Date.now() / 1000) + 3600)
  }
  await broadcast(response.participants, response, 'new-chat');
  return { statusCode: 200 };
}

