export class User {
    constructor ({id = "", name = "", email = "", password = "", role = "", cafeteriaName = "", experience= "", profilePicture = "", paymentMethod = ""}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.cafeteriaName = cafeteriaName;
        this.experience = experience;
        this.profilePicture = profilePicture;
        this.paymentMethod = paymentMethod;
    }
}