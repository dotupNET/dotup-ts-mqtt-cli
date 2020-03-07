#!/usr/bin/env node
import { MqttConnection, QosType, ConfigureLogging } from "@dotup/dotup-ts-mqtt";
import * as os from "os";
// import enquirer from "enquirer";
import { prompt } from "enquirer";

let prefix = "production";
if (process.env.NODE_ENV !== undefined) {
  prefix = process.env.NODE_ENV;
}

ConfigureLogging(`${__dirname}/assets/logging.${prefix}.json`);


function getHostname(): string {
  return os.hostname();
}

async function getTopicToSubscribe(): Promise<string> {
  const answer = await prompt<{ topic: string }>({
    type: "input",
    name: "topic",
    message: "Enter topic filter",
    result: (value) => {
      if (value === undefined || value.length < 1) {
        return "#";
      } else {
        return value;
      }
    }
  });

  return answer.topic;
}

async function getTopicToPublish(): Promise<string> {

  const answer = await prompt<{ topic: string }>({
    type: "input",
    name: "topic",
    message: "Enter topic to publish",
    initial: "test",
    result: (value) => {
      if (value === undefined || value.length < 1) {
        return "test";
      } else {
        return value;
      }
    }
  });

  return answer.topic;
}

async function getMqttHostName(): Promise<string> {

  const answer = await prompt<{ host: string }>({
    type: "input",
    name: "host",
    message: "Enter MQTT server name",
    initial: "localhost",
    result: (value) => {
      if (value === undefined || value.length < 1) {
        return "localhost";
      } else {
        return value;
      }
    }
  });

  return answer.host;
}

export class Sample {

  private mqtt: MqttConnection;

  async run(): Promise<void> {


    const host = await getMqttHostName();

    // Initialize logger
    this.mqtt = new MqttConnection();

    console.log(`Connecting to ${host}`);

    await this.mqtt.connect({
      host: host,
      protocol: "ws",
      port: 1883,
      clientId: `dotup-ts-mqtt-${getHostname()}`
    });

    const t = await getTopicToSubscribe();
    this.mqtt.subscribe(t, (topic, message) => {
      console.log(`topic: ${topic}| message: ${message}`);
    });

    const ts = await getTopicToPublish();
    const pcname = getHostname();

    setInterval(() => {
      this.mqtt.publish<string>({
        topic: `${pcname}/${ts}`,
        message: new Date().toUTCString(),
        // messageId: '1',
        QoS: QosType.AtMostOnce,
        retain: false,
        transferState: 0, //TransferState.New,
        transferTimestamp: new Date(new Date().toUTCString())
      });

    }, 1000);
  }

}

const sample = new Sample();
sample
  .run()
  .catch(err => console.log(err));
