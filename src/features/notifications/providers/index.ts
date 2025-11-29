"use server"
import type {ProviderKind, EventPayload, DispatchResult} from '../types';
import {sendSlack} from './slack';
import {sendSmtp} from './smtp';

const handlers: Record<
    ProviderKind,
    (config: any, payload: EventPayload) => Promise<DispatchResult>
> = {
    slack: sendSlack,
    smtp: sendSmtp,
};

export async function dispatchViaProvider(
    kind: ProviderKind,
    config: any,
    payload: EventPayload,
    channelId: string
): Promise<DispatchResult> {
    const handler = handlers[kind];
    if (!handler) {
        return {
            success: false,
            channelId,
            provider: kind,
            error: `Unsupported provider: ${kind}`,
        };
    }

    try {
        return await handler(config, payload);
    } catch (err: any) {
        return {
            success: false,
            channelId,
            provider: kind,
            error: err.message || 'Unknown error',
        };
    }
}