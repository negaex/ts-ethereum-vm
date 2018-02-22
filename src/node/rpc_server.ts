'use strict';

import * as http from 'http';
import { Node } from './node';
import { methods } from './rpc_calls';

// we'll use a very very very simple routing mechanism
// don't do something like this in production, ok technically you can...
// probably could even be faster than using a routing library :-D

// request Listener
// this is what we'll feed into http.createServer
class RPCListener {
    node: Node;

    constructor(node: Node) {
        this.node = node;
    }

    rpc = async (body: any) => {
        console.log(`JSON: ${body}`);
        let _json = JSON.parse(body); // might throw error
        return methods[_json.method](this.node, _json.params);
    }

    requestListener = (request: any, response: any) => {
        console.log('Received connection');
        response.setHeader('Content-Type', 'application/json');

        // buffer for incoming data
        let buf: Buffer = null;

        // listen for incoming data
        request.on('data', (data: any) => {
            buf = buf === null ? data : buf + data;
        });

        // on end proceed with compute
        request.on('end', () => {
            let body: string = buf !== null ? buf.toString() : null;

            this.rpc(body).then(res => {
                const jsonRes = {
                    'id': 1,
                    'jsonrpc': '2.0',
                    'result': res,
                };
                console.log(JSON.stringify(jsonRes));
                response.end(JSON.stringify(jsonRes));
            }).catch(err => {
                console.error(err);
                response.statusCode = 500;
                response.end('oops! server error!');
            });
        });
    }
}

export const runRPC = (node: Node) => {
    const listener = new RPCListener(node);
    let server = http.createServer(listener.requestListener);
    const PORT = process.env.NODE_PORT || 9090;
    console.log(`starting the server on port ${PORT}`);
    server.listen(PORT);
};