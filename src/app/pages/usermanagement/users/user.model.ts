export class UserLoginModel {
    email: string;
    password: string;
}

export class User {
    id: number;
    firstName: string;
    lastName: string;
    imagePath: string;
    userName: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    roleId: number;
    timezone:string;
    roleName: string;
    isActive: boolean;

    constructor(user) {
        {
            this.id = user.id || 0;
            this.firstName = user.firstName || '';
            this.lastName = user.lastName || '';
            this.imagePath = user.imagePath || 'assets/images/default/users/no-image.jpg';
            this.userName = user.userName || '';
            this.password = user.password || '';
            this.email = user.email || '';
            this.phone = user.phone || '';
            this.address = user.address || '';
            this.roleId = user.roleId;
            this.timezone = user.timezone || '';
            this.roleName = user.roleName || '';
            this.isActive = user.isActive || 1;            
        }
    }
}

export class UserChangePassword {
    userId: number;
    password: string;
    confirmPassword: string;
    constructor(userChangePassword) {
        {
            this.userId = userChangePassword.userId || 0;
            this.password = userChangePassword.password || '';
            this.confirmPassword = userChangePassword.confirmPassword || '';
        }
    }
}

export class SingleSignOnModel {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    googleUserId: string;
    facebookUserId: string;
}