
export interface CartItem{
    picture: string;
    name: string;
    brand: string;
    description: string;
    category: string;
    qty: number;
    size ?: string;
    color ?: string;
    shippingFee: number;
    deliveryFee: number;
    taxFee: number;
    deliveryDate: Date;
    price: number;
}

