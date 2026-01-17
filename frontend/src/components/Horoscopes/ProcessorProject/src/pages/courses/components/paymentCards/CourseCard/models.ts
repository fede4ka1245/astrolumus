export interface PaymentList {
  description: string;
  show: boolean;
}

export interface PaymentBonusList {
  description: string;
  show: boolean;
  disabled: boolean;
}

export interface ICoursePaymentCard {
  title: string;
  image: string;
  list:PaymentList[];
  bonus_list: PaymentBonusList[];
  description: string;
  subtitle?:string;
  full_price: number;
  discount_price: number;
  payment_title: string;
  button_text?: string;
  monthly_fee: {
    show: boolean;
    quantity: string;
    price: number;
    title: string;
  } 
}
