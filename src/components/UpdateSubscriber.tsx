'use client';

import { type ReactNode, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

export interface RootStoreProviderProps {
    children: ReactNode;
}

export const UpdateSubscriberComponent = () => {
    const eventsRef = useRef<string[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/v1/events');
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader?.read() || {};
                    if (done) break;
                    if (value) {
                        const event = decoder.decode(value, { stream: true });
                        console.log({ event });
                        eventsRef.current.push(event);
                        // Optionally, update the store with the new events
                        // storeRef.current?.setState({ events: eventsRef.current });
                    } else {
                        console.log('No value read from reader');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div>HELLO SSE</div>
    );
};

const UpdateSubscriber = dynamic(() => Promise.resolve(UpdateSubscriberComponent), {
    ssr: false,
});

export default UpdateSubscriber;
