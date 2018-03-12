'use strict';

import * as http from 'http';
import { Node } from './node';
import { methods, RPCMethod } from './rpc_calls';

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

    rpc = async (body: string): Promise<any> => {
        console.log(`JSON: ${body}`);
        let _json: any = JSON.parse(body); // might throw error
        const method: RPCMethod = methods[_json.method];
        if (method == null) {
            throw `Unknown method ${_json.method}`;
        }
        return method(this.node, _json.params);
    }

    requestListener = (request: any, response: any): void => {
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

            if (body === null) {
                response.statusCode = 200;
                response.end('{}');
                return;
            }

            this.rpc(body).then((res: string) => {
                const jsonRes: object = {
                    'id': 1,
                    'jsonrpc': '2.0',
                    'result': res,
                };
                console.log(JSON.stringify(jsonRes));
                response.end(JSON.stringify(jsonRes));
            }).catch((err: Error) => {
                console.error(err);
                response.statusCode = 500;
                response.end('oops! server error!');
            });
        });
    }
}

export function runRPC(node: Node): void {
    const listener: RPCListener = new RPCListener(node);
    let server: http.Server = http.createServer(listener.requestListener);
    const PORT: string | 9090 = process.env.NODE_PORT || 9090;
    console.log(`starting the server on port ${PORT}`);
    server.listen(PORT);
}