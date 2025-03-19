/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { addClient, removeClient } from '@/lib/eventManager';

export async function GET(req: NextRequest) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    addClient(writer as any);

    req.signal.addEventListener('abort', () => {
        removeClient(writer as any);
    });

    writer.write(encoder.encode('data: connected\n\n'));

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}