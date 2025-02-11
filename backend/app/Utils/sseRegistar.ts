import { ResponseContract } from "@ioc:Adonis/Core/Response";

const sseRegisteredUsers = new Map<string, ResponseContract>();

export { sseRegisteredUsers };
