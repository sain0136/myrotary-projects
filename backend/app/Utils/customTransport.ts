import { createWriteStream } from "fs";

export default function customTransport(
  options: any
): import("fs").WriteStream {
  return createWriteStream(options.destination, { flags: "a" });
}
