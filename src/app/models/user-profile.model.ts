export interface ShippingAddress {
  name: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface UserProfile {
  uid: string;
  nickname: string;
  email: string;
  addresses: ShippingAddress[];
}