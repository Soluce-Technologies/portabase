
export function generateEdgeKey(serverUrl: string, agentId: string): string {
    const edgeKeyData = {
        serverUrl,
        agentId,
    };
    console.log(edgeKeyData);
    const edgeKeyJson = JSON.stringify(edgeKeyData);
    const edgeKeyBuffer = Buffer.from(edgeKeyJson, 'utf-8');
    const edgeKeyBase64 = edgeKeyBuffer.toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    return edgeKeyBase64;
}

function decodeEdgeKey(edgeKey: string): object {
    let edgeKeyWithPadding = edgeKey.replace(/-/g, '+').replace(/_/g, '/');
    const paddingNeeded = edgeKeyWithPadding.length % 4;
    if (paddingNeeded !== 0) {
        edgeKeyWithPadding += '='.repeat(4 - paddingNeeded);
    }
    const edgeKeyBuffer = Buffer.from(edgeKeyWithPadding, 'base64');
    const edgeKeyJson = edgeKeyBuffer.toString('utf-8');
    return JSON.parse(edgeKeyJson);
}
