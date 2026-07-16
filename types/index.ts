export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  is_admin: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  area_sqft: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}

export interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}
