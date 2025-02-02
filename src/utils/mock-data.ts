export const organizations = [
    {
        "id": "org-1a2b3c4e",
        "slug": "default",
        "name": "Default Organization",
        "createdAt": "2024-01-10T10:00:00.000Z",
        "projects": []
    },
    {
        "id": "org-1a2b3c4d",
        "slug": "tech-corp",
        "name": "Tech Corp",
        "createdAt": "2024-01-10T10:00:00.000Z",
        "projects": []
    },
    {
        "id": "org-2e3f4g5h",
        "slug": "design-studio",
        "name": "Design Studio",
        "createdAt": "2023-09-15T15:45:00.000Z",
        "projects": []
    }
]

export const projects = [
    {
        "id": "proj-1234abcd",
        "slug": "backend-system",
        "name": "Backend System",
        "createdAt": "2024-02-20T11:30:00.000Z",
        "organizationId": "org-1a2b3c4d",
        "databases": []
    }, {
        "id": "proj-5678efgh",
        "slug": "creative-suite",
        "name": "Creative Suite",
        "createdAt": "2023-10-10T08:20:00.000Z",
        "organizationId": "org-2e3f4g5h",
        "databases": []
    }
]

export const databases = [
    {
        "id": "c1a8e77c-eed9-4c8f-a9f7-90deabc3b78e",
        "name": "Main Production DB",
        "dbms": "postgresql",
        "generatedId": "prod-db-1",
        "description": "Primary database for production environment",
        "backupPolicy": "daily",
        "createdAt": "2024-11-01T12:00:00.000Z",
        "agentId": "agent-1234",
        "lastContact": "2024-11-28T08:30:00.000Z",
        "projectId": "proj-789",
        "backups": [],
        "restorations": []
    },
    {
        "id": "1e4f9265-5f10-4bd4-8e5c-3283746cfd7a",
        "name": "Staging DB",
        "dbms": "mysql",
        "generatedId": "staging-db-2",
        "description": "Database for testing and staging environment",
        "backupPolicy": "weekly",
        "createdAt": "2024-10-15T09:45:00.000Z",
        "agentId": "agent-5678",
        "lastContact": "2024-11-25T10:15:00.000Z",
        "projectId": null,
        "backups": [],
        "restorations": []
    },
    {
        "id": "b6f92bd7-834b-41c1-b6b3-dc4214b1de08",
        "name": "Development DB",
        "dbms": "mongodb",
        "generatedId": "dev-db-3",
        "description": null,
        "backupPolicy": null,
        "createdAt": "2024-09-20T16:20:00.000Z",
        "agentId": "agent-9012",
        "lastContact": null,
        "projectId": "proj-456",
        "backups": [],
        "restorations": []
    }
]

export const backups = [
    {'id': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
    {'id': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
    {'id': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
    {'id': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
    {'id': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
    {'id': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
    {'id': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
    {'id': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
    {'id': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
    {'id': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'},
    {'id': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
    {'id': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
    {'id': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
    {'id': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
    {'id': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
    {'id': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
    {'id': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
    {'id': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
    {'id': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
    {'id': 'backup-11', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
]

export const restorations = [
    {'id': 'restore-1', 'backupId': 'backup-1', 'createdAt': '2023-11-27T11:26:54.870914Z', 'status': 'pending'},
    {'id': 'restore-2', 'backupId': 'backup-2', 'createdAt': '2023-12-03T11:26:54.870927Z', 'status': 'failed'},
    {'id': 'restore-3', 'backupId': 'backup-3', 'createdAt': '2023-12-12T11:26:54.870937Z', 'status': 'success'},
    {'id': 'restore-4', 'backupId': 'backup-4', 'createdAt': '2023-11-23T11:26:54.870946Z', 'status': 'processing'},
    {'id': 'restore-5', 'backupId': 'backup-5', 'createdAt': '2023-12-09T11:26:54.870955Z', 'status': 'pending'},
    {'id': 'restore-6', 'backupId': 'backup-6', 'createdAt': '2023-11-29T11:26:54.870964Z', 'status': 'failed'},
    {'id': 'restore-7', 'backupId': 'backup-7', 'createdAt': '2023-12-07T11:26:54.870973Z', 'status': 'success'},
    {'id': 'restore-8', 'backupId': 'backup-8', 'createdAt': '2023-11-18T11:26:54.870982Z', 'status': 'processing'},
    {'id': 'restore-9', 'backupId': 'backup-9', 'createdAt': '2023-12-01T11:26:54.870991Z', 'status': 'pending'},
    {'id': 'restore-10', 'backupId': 'backup-10', 'createdAt': '2023-11-25T11:26:54.871000Z', 'status': 'failed'}
]