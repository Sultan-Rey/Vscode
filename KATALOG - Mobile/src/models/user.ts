import { Address } from "src/models/addresses";

export class User{
     public constructor(init ?: Partial<User>){Object.assign(this,init);}
type ?: string;
name: string;
civilite: string;
birthday: Date;
address: Address;
email: string;
password: string;
phone: string;
method:string;
connection ?: boolean;
status ?:boolean;
}
