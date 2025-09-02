import dotenv from "dotenv";
import { Server } from "./app";

import "./jobs/check_users_streak_job";

dotenv.config();

const server = new Server();

server.setup();
server.start();

export { server };
