import { createWriteStream } from "fs";

export default function customTransport(options: any): any {
  return createWriteStream(options.destination, { flags: "a" });
}
