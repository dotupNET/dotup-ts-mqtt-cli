import { MqttConnection, QosType } from "@dotup/dotup-ts-mqtt";
import * as os from "os";
import enquirer from "enquirer";


function getHostname(): string {
  return os.hostname();
}

async function getTopicToSubscribe(): Promise<string> {

  const answer = await enquirer.prompt<{ topic: string }>({
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

  const answer = await enquirer.prompt<{ topic: string }>({
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

export class Sample {

  private mqtt: MqttConnection;

  async run(): Promise<void> {



    // Initialize logger
    this.mqtt = new MqttConnection();
    await this.mqtt.connect({
      host: "localhost",
      protocol: "ws",
      port: 1883,
      clientId: `dotup-ts-mqtt-${getHostname()}`
    });

    const t = await getTopicToSubscribe();
    this.mqtt.subscribe(t, (topic, message) => {
      console.log(`topic: ${topic}| message: ${message}`);
    });

    const ts = await getTopicToPublish();
    setInterval(() => {
      this.mqtt.publish<string>({
        topic: ts,
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
