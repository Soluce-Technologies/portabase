export type ProviderKind = 'slack' | 'smtp';

export interface DispatchResult {
    success: boolean;
    channelId?: string;
    provider: ProviderKind | null;
    message?: string;
    error?: string;
    response?: any;
}

export interface EventPayload {
    title: string;
    message: string;
    level: 'critical' | 'warning' | 'info';
    timestamp?: Date;
    data?: Record<string, any>;
}