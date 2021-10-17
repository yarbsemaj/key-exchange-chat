import randomBigint from "../randomBigInt";
import { decryptMessage, encryptMessage } from "../libs/AES";
import { Chat } from "../stores/state";
import { addAlert } from "../stores/alerts";
import type Partcipant from "./Partcipant";
import type Message from "./Message";
import JSEncrypt from 'jsencrypt'
import CryptoES from "crypto-es";

class ChatClient {
  private static instance: ChatClient;
  private websocket: WebSocket;

  private sharedSecret: bigint;
  private randomValue: bigint;
  public chatID: string;

  public messages: Array<Message> = [];

  public grmn: bigint;
  public participants: Array<Partcipant>

  public publicKey: string;
  public privateKey: string;

  public remotePublicKey: string

  //Public components
  public static g = BigInt(process.env.G);
  public static n = BigInt(process.env.N);

  public static getInstance(endpoint: string): ChatClient {
    if (!ChatClient.instance) {
      ChatClient.instance = new ChatClient(endpoint);
    }
    return ChatClient.instance;
  }

  constructor(endpoint: string) {
    this.websocket = new WebSocket(endpoint);

    let pair = new JSEncrypt();
    pair.getKey(() => {
      this.publicKey = pair.getPublicKey();
      this.privateKey = pair.getPrivateKey();
      Chat.set(this);
    })


    this.websocket.onclose = ({ wasClean, code, reason }) => {
      console.log(
        `onclose:   ${JSON.stringify({ wasClean, code, reason })}`);
    };

    this.websocket.onerror = error => {
      console.log(error);
      console.log(
        'onerror:   An error has occurred. See console for details.'
      );
    };

    this.randomValue = randomBigint(8000) % ChatClient.g;

    this.websocket.onmessage = this.handelMessage.bind(this);

    this.websocket.onopen = () => {
      console.log('onopen:    Connected successfully.');
    };
    Chat.set(this);
  }

  newChat(): void {
    this.websocket.send(
      JSON.stringify({ action: 'startChat', data: { publicKey: this.publicKey } })
    );
  }

  private handelMessage({ data }): void {
    let payload = JSON.parse(data);
    switch (payload.type) {
      case 'new-chat':
        this.chatID = payload.message.chatID;
        this.participants = payload.message.participants;
        break;
      case 'join-chat':
        this.chatID = payload.message.chatID;
        this.participants = payload.message.participants;
        this.shareKey(this.generateKey(), payload.message.chatID, this.publicKey)
        break;
      case 'share-key':
        this.receiveKey(payload.message);
        break;
      case 'message':
        this.reciveMessage(payload.message.value);
        break;
      default:
        addAlert('Something has gone wrong');
    }
    Chat.set(this);
  }

  private generateKey(): bigint {
    this.grmn = (ChatClient.g ^ this.randomValue) % ChatClient.n;
    return this.grmn;
  }

  private shareKey(grmn: BigInt, chatID: string, key: string): void {
    var sign = new JSEncrypt();
    sign.setPrivateKey(this.privateKey);
    let sig = sign.sign(grmn.toString(16), (str) => { return CryptoES.enc.Hex.stringify(CryptoES.SHA256(str)) }, "sha256")
    this.websocket.send(
      JSON.stringify({ action: 'message', data: { type: 'share-key', chatID, message: { value: grmn.toString(16), sig, key } } })
    );
  }

  public sendMessage(message: string): void {
    let messageJson = { message, date: (new Date).toISOString() };
    this.messages.push({ ...messageJson, remote: false });
    let cyper = encryptMessage(btoa(encodeURIComponent(JSON.stringify(messageJson))), this.sharedSecret.toString(16));
    this.websocket.send(
      JSON.stringify({ action: 'message', data: { type: 'message', chatID: this.chatID, message: { value: cyper } } })
    );
    Chat.set(this);
  }

  public reciveMessage(message: string): void {
    let messageJson = JSON.parse(decodeURIComponent(atob(decryptMessage(message, this.sharedSecret.toString(16)))));
    this.messages.push({ ...messageJson, remote: true });
  }

  private receiveKey(response): void {
    var verify = new JSEncrypt();
    this.remotePublicKey = response.key;
    verify.setPublicKey(response.key);
    let valid = verify.verify(response.value, response.sig, (str) => { return CryptoES.enc.Hex.stringify(CryptoES.SHA256(str)) })
    if (valid) {
      this.sharedSecret = (BigInt(`0x${response.value}`) ^ this.randomValue) % ChatClient.n;
    } else {
      addAlert('Signature invalid');
    }
  }

  joinChat(chatID): void {
    this.websocket.send(
      JSON.stringify({ action: 'connectToChat', data: { chatID, publicKey: this.publicKey } })
    );
  }

  disconnect() {
    this.websocket.close();
  }
}

export default ChatClient