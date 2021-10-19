export class Role {
    id: string;
    name: string;
    internalRoleId: number;
    permissionSetId: string;
    permissionSetName: string;

    constructor(role) {
        this.id = role.id || 0;
        this.name = role.name || '';
        this.internalRoleId = role.internalRoleId;
        this.permissionSetId = role.permissionSetId;
        this.permissionSetName = role.permissionSetName || '';
    }
}
