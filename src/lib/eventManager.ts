import { WritableStreamDefaultWriter } from 'stream/web';

let clients: WritableStreamDefaultWriter[] = [];

export function addClient(client: WritableStreamDefaultWriter) {
    clients.push(client);
}

export function removeClient(client: WritableStreamDefaultWriter) {
    clients = clients.filter((c) => c !== client);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function notifyClients(data: any) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    console.log(payload);
    const encoder = new TextEncoder();
    clients.forEach((client) => client.write(encoder.encode(payload)));
}