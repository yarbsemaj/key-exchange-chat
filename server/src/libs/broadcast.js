
const AWS = require('aws-sdk');

const apig = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.APIG_ENDPOINT
});

module.exports = (participants, message, type) => {
    return Promise.all(participants.map((participant) => apig.postToConnection({
        ConnectionId: participant.connectionId,
        Data: JSON.stringify({
            message,
            type
        })
    }).promise()))
}
