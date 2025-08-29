"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express4_1 = require("@as-integrations/express4");
const connect_database_1 = require("./config/connect_database");
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const gpql_1 = require("./gpql/gpql");
const generics_1 = require("./types/generics");
const routers_1 = require("./routers/routers");
class Server {
    constructor() {
        this.prefix = process.env.API_PREFIX || "/api/v1";
    }
    init_routes() {
        for (const router of routers_1.routers) {
            this.app.use(this.prefix, router);
        }
    }
    set_middlewares() {
        this.app.use((0, body_parser_1.json)());
        this.app.use((0, cors_1.default)({
            origin: "*",
        }));
        this.app.use((0, cookie_parser_1.default)(generics_1.JwtSecret.toString()));
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app = (0, express_1.default)();
            const db = yield (0, connect_database_1.connect_database)();
            if (db) {
                this.db = db;
            }
            this.set_middlewares();
            this.init_routes();
            const apollo_server = yield (0, gpql_1.create_apollo_server)();
            if (apollo_server) {
                this.app.use("/graphql", (0, cors_1.default)({
                    origin: "*",
                }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(apollo_server
                // ,{ context: set_apollo_context }
                ));
            }
        });
    }
    start() {
        if (process.env.NODE_ENV !== "test") {
            const PORT = process.env.PORT || 8080;
            this.app.listen(PORT, () => {
                console.log("");
                console.log("===================================");
                console.log(`Server is running on http://localhost:${PORT}${this.prefix}`);
                console.log("===================================");
            });
        }
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db && this.db.connection.readyState !== 0) {
                yield this.db.disconnect();
            }
        });
    }
}
exports.Server = Server;
