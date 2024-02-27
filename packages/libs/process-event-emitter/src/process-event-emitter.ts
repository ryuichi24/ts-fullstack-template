import { ChildProcess } from "child_process";
import { EventEmitter } from "events";

export type Message = {
  event: string;
  payload: any;
};

export class ProcessEventEmitter {
  private eventEmitter;
  private _process: ChildProcess | NodeJS.Process;

  constructor(childProcess?: ChildProcess | null) {
    this.eventEmitter = new EventEmitter();
    this._process = childProcess ?? process;
    this.init();
  }

  private init() {
    this._process.on("message", (msg: Message) => this.eventEmitter.emit(msg.event, msg.payload));
  }

  public emit(event: string, payload?: Message["payload"]) {
    this._process.send?.({ event, payload });
  }

  public on(event: string, handler: (payload: Message["payload"]) => void) {
    this.eventEmitter.on(event, handler);
  }
}
