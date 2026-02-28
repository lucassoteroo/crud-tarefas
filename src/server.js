import http from "http";
import { json } from "./middlewares/json.js";

const server = http.createServer(async (req, res) => {
    await json(req, res)
})

server.listen(3333)