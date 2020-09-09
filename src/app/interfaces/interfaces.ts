export interface Client {
  id: number;
  name: string;
  last_name: string;
  enterprise_name?: string;
  neighborhood: string;
  document_type: document_type;
  document_number: string;
  phone_number: string;
  city: string;
  direction: string;
  active: boolean;
  updated_at: Date;
  created_at: Date;
}

type document_type = 'nit' | 'c.c';

export interface Login {
  username: string;
  password: string;
}

export interface Locales {
  id: number;
  client: Client | null;
  name: string;
  location: string;
  price: number;
  vat: number;
  observation: string;
  created_at: Date;
  updated_at: Date;
  active: boolean;
}

export interface Token {
  token: string;
}

export interface ClientsPages {
  results: Client[];
  next: string;
  count: number;
  previous: string;
}

export interface ClientSimple {
  id: number;
  name: string;
  last_name: string;
}

export interface LocalesPages {
  count: number;
  next: string;
  previous: string;
  results: Locales[];
}

export interface FacturasPages {
  count: number;
  next: string;
  previous: string;
  results: Facture[];
}

export interface Navegacion {
  name: string;
  url: string;
}

export interface Facture {
  id: number;
  active: boolean;
  facture_number: number;
  payment_date: Date;
  total_paid: number;
  client_name: string;
  client_last_name: string;
  client_document_type: string;
  client_document_number: string;
  client_phone_number: string;
  client_city: string;
  client_direction: string;
  place_name: string;
  place_location: string;
  place_price: number;
  place_vat: number;
  facture_date: string;
  way_to_pay: string;
  administration_price: number;
  administration_vat: number;
  water_service_price: number;
  water_service_vat: number;
  energy_service_price: number;
  energy_service_vat: number;
  total_to_pay: number;
  price_humanized: string;
  client_enterprise_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface PagesAbonos {
  count: number;
  next: string;
  previous: string;
  results: Abonos[];
}

export interface Abonos {
  id: number;
  active: boolean;
  facture: Facture;
  total_to_pay: number;
  facture_date: string;
  payment_date?: any;
  created_at: Date;
  updated_at: Date;
}
