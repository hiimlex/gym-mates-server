import dotenv from "dotenv";
import { Server } from "./app";

dotenv.config();

const server = new Server();

server.setup();
server.start();

export { server };
