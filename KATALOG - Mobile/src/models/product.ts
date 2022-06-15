import { Displays } from "./display";

export interface Product{

    code: string;
    name: string;
    description: string;
    brand: string;
    rating: number;
    category: string;
    subcategory?:string;
    qty: number;
    shipment: string;
    policy: boolean;
    shippingFee: number;
    deliveryFee: number;
    taxFee: number;
    about ?: string;
    deliveryDate ?: Date;
    status: boolean;
    ref ?: any;
    size?: string[];
    availability: string;
    display: Displays; 
    orderedqty ?: number;
    creation_date?: Date;
    discount?: number;
    models ?: Model[];  
    caracteristic ?: Caracteristic[];
    other?:string;
  }


  export interface Model{
    id: string;
    pictures: string[];
  }

  export interface Caracteristic{
    color: string;
    size: string;
    qty: number;
    price: number;
    availability: string;
  }