export async function GET() {
    return new Response('OK', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
