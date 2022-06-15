export interface StarCard{
    id: string;
    amount: number;
    devise: string;
    transactions: Transactions[];
    reedem: Reedeem[];
    activation?:boolean;
}

export interface Transactions{
    orderId: string;
    amount: number;
    date: Date;
}
export interface Reedeem{
    amount: number;
    date: Date;
}