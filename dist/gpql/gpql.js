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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_apollo_server = void 0;
const server_1 = require("@apollo/server");
const composer_1 = require("./composer");
const create_apollo_server = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = composer_1.schemaComposer.buildSchema();
        const server = new server_1.ApolloServer({
            schema,
        });
        yield server.start();
        return server;
    }
    catch (error) {
        console.error("Error creating Apollo Server:", error);
    }
});
exports.create_apollo_server = create_apollo_server;
