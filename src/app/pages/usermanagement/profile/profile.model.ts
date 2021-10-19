export class Profile {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    imagePath: string;
    phone: string;
    phoneMobile: string;
    timezone:string;
    isActive:boolean;
    addresses: ProfileAddress;

    constructor(profile) {
        this.id = profile.id || 0;
        this.firstName = profile.firstName || '';
        this.middleName = profile.middleName || '';
        this.lastName = profile.lastName || '';
        this.imagePath = profile.imagePath || 'assets/images/default/users/no-image.jpg';
        this.email = profile.email || '';
        this.phone = profile.phone || '';
        this.phoneMobile = profile.phone || '';
        this.timezone = profile.timezone || '';
        this.timezone = profile.timezone || '';
        this.isActive = profile.timezone || false;

        this.addresses = new ProfileAddress(profile.addresses != undefined ? profile.addresses : {});
        // this.addresses.id = profile.address.id != null ? profile.address.id : 0;
        // this.addresses.address1 = profile.address.address1 != null ? profile.address.address1 : '';
        // this.addresses.address2 = profile.address.address2 != null ? profile.address.address2 : '';
        // this.addresses.city = profile.address.city != null ? profile.address.city : '';
        // this.addresses.stateCode = profile.address.stateCode != null ? profile.address.stateCode : '';
        // this.addresses.postalCode = profile.address.postalCode != null ? profile.address.postalCode : '';
        // this.addresses.country = profile.address.country != null ? profile.address.country : '';
    }
}

export class ProfileAddress {
    id: number;
    address1: string;
    address2: string;
    city: string;
    stateCode: string;
    stateOrProvince: string;
    postalCode: string;
    country: string;
    stateId: number;
    stateName: string;

    constructor(profileAddress) {
        this.id = profileAddress.id || 0;
        this.address1 = profileAddress.address1 || '';
        this.address2 = profileAddress.address2 || '';
        this.city = profileAddress.city || '';
        this.stateCode = profileAddress.stateCode || '';
        this.postalCode = profileAddress.postalCode || '';
        this.country = profileAddress.country || '';        
        this.stateId = profileAddress.stateId || '';
        this.stateName = profileAddress.stateName || '';
        this.stateOrProvince = profileAddress.stateOrProvince || '';
    }
}

export class ProfileChangePassword {
    id: number;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}