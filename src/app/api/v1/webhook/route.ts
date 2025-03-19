import { NextRequest, NextResponse } from 'next/server';
import { notifyClients } from '@/lib/eventManager';

export async function POST(req: NextRequest) {
    const data = await req.json();
    notifyClients(data);
    return NextResponse.json(data);
}