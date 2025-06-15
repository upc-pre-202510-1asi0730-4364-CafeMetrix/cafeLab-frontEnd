export class User {
    constructor({
                    id = 0,
                    name = "",
                    email = "",
                    password = "",
                    role = "",
                    cafeteriaName = "",
                    experience = "",
                    profilePicture = "",
                    paymentMethod = "",
                    isFirstLogin = false,
                    plan = "",
                    hasPlan = false
                }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.cafeteriaName = cafeteriaName;
        this.experience = experience;
        this.profilePicture = profilePicture;
        this.paymentMethod = paymentMethod;
        this.isFirstLogin = isFirstLogin;
        this.plan = plan;
        this.hasPlan = hasPlan;
    }
}