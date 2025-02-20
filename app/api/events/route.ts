import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export async function GET(request: Request) {
    console.log('GET request received');

    return new Response(
        new ReadableStream({
            start(controller) {
                console.log('Stream started');

                const handleModification = (data: any) => {
                    console.log('Modification event triggered:', data);
                    controller.enqueue(`event: modification\n`);
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                };

                eventEmitter.on('modification', handleModification);

                // Handle client disconnect
                request.signal.addEventListener('abort', () => {
                    console.log('Client disconnected');
                    controller.close();
                    eventEmitter.off('modification', handleModification);
                });
            },
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        }
    );
}

export async function POST(request: Request) {
    console.log('POST request received');
    const data = await request.json();
    console.log('Data received:', data);

    // Emit the event to all connected clients
    eventEmitter.emit('modification', data);

    return new Response('Event sent', { status: 200 });
}