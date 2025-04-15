import { Client, Message } from 'react-native-paho-mqtt';

export interface MQTTConfig {
  username: string;
  aioKey: string;
}

export class MQTTClient {
  private client: ReturnType<typeof Client> | null = null;
  private config: MQTTConfig;
  private onMessageCallback: (topic: string, payload: string) => void;

  constructor(config: MQTTConfig, onMessage: (topic: string, payload: string) => void) {
    this.config = config;
    this.onMessageCallback = onMessage;
  }

  async connect() {
    try {
      // Initialize MQTT client
      this.client = new Client({
        uri: 'ws://broker.hivemq.com:8000/mqtt', // Use ws:// for WebSocket, tcp:// for non-SSL
        clientId: `client-${Math.random().toString(16).slice(3)}`,
        storage: undefined, // Use default storage
      });

      // Set credentials
      this.client.setCredentials(this.config.username, this.config.aioKey);

      // Handle messages
      this.client.on('messageReceived', (message: any) => {
        this.onMessageCallback(message.destinationName, message.payloadString);
      });

      // Handle connection
      this.client.on('connectionLost', (err: any) => {
        if (err) {
          console.error('MQTT connection lost:', err);
        }
        console.log('Disconnected from MQTT broker');
      });

      // Connect to broker
      await this.client.connect();

      console.log('Connected to MQTT broker');

      // Subscribe to topics
      this.subscribe(`${this.config.username}/feeds/lightfeed`);
      this.subscribe(`${this.config.username}/feeds/temperaturefeed`);
      this.subscribe(`${this.config.username}/feeds/humidityfeed`);
    } catch (err) {
      console.error('MQTT connection failed:', err);
      throw err;
    }
  }

  subscribe(topic: string) {
    if (this.client) {
      this.client.subscribe(topic).then(() => {
        console.log(`Subscribed to ${topic}`);
      }).catch((err: Error) => {
        console.error(`Subscribe to ${topic} failed:`, err.message);
      });
    } else {
      console.error('Cannot subscribe: MQTT client not initialized');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      console.log('Disconnected from MQTT broker');
    }
  }
}