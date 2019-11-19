export class User {
    id: number;
    password: string;
    first_name: string;
    last_name: string;
    registration_date: Date;
    image_path: string;
    company_id: number;
    username: string;
    is_admin: boolean;

    constructor(user: User = null) {
     if (user != null) {
       this.id = user.id;
       this.password = user.password;
       this.first_name = user.first_name;
       this.last_name = user.last_name;
       this.image_path = user.image_path;
       this.registration_date = user.registration_date;
       this.company_id = user.company_id;
       this.username = user.username;
       this.is_admin = user.is_admin;
     }
   }
}
