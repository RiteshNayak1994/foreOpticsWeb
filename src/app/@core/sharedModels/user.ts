export class User {
    username: string;
    password: string;
}

export class UserDetail {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    userName: string;
    imagePath: string;
    roleId: number;
    roleName: string;
    phone: string;
    isDefaultAdmin: string;
    fullName: string;
    TotalRecords: number;
}

// export class AddUserModel {
//     id: number;
//     first_name: string;
//     last_name: string;
//     phone: string;
//     email: string;
//     active: string;
//     role: string;
//     // title:string;
//     address: string;
//     state:string;
//     city: string;
//     zip: string;
// }

export class LoggedUser {
    accessToken: string;
    isSuperAdmin: boolean;
    email: string;
    firstName: string;
    imagePath: string;
    lastName: string;
    middleName: string;
    phone: string;
    phoneMobile: string;
    roleName: string;
    tenantId: number
    tenantName: string;
    userId: number;
    userPermissionHash: string;
}