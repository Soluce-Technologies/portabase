

export async function checkAllPermissions(db: any, model: string) {
    const operations = ['read', 'create', 'update', 'delete'];
    const results: Record<string, boolean> = {};

    for (const operation of operations) {
        // Dynamically access the model and check permissions
        results[operation] = await db[model].check({ operation });
    }

    const hasAllPermissions = Object.values(results).every(permission => permission === true);

    console.log('Permissions:', results);
    console.log('Has all permissions:', hasAllPermissions);

    return hasAllPermissions;
}