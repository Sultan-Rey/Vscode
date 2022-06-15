export interface Paymethod{
    id: string;
    method: string;
    provider: string;
    credential: PaymentCredential;
    default?:boolean;
}
export interface PaymentCredential{
    email?:string;
    phone?:string;
    code?: number;
    options?:string;
}