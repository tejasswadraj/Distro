import type { Product, Customer, RatesOverride, Supplier } from "@/types";

export const PRODUCTS: Product[] = [
  { Item_Code: "PTFR-0065-72-05", Item_Name: "FROOTI PET 65ML", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 65, Case_Pack: 72, MRP: 5, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 310, Purchase_Rate: 275, Offer_Buy_Qty: 12, Offer_Free_Qty: 1, Offer_Active: true },
  { Item_Code: "PTFR-0125-48-10", Item_Name: "FROOTI PET 125ML", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 125, Case_Pack: 48, MRP: 10, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 400, Purchase_Rate: 355, Offer_Buy_Qty: 10, Offer_Free_Qty: 1, Offer_Active: true },
  { Item_Code: "PTFR-0200-24-20", Item_Name: "FROOTI PET 200ML", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 200, Case_Pack: 24, MRP: 20, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 380, Purchase_Rate: 340 },
  { Item_Code: "PTFR-0330-24-40", Item_Name: "FROOTI PET 330ML", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 330, Case_Pack: 24, MRP: 40, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 620, Purchase_Rate: 555, Offer_Buy_Qty: 8, Offer_Free_Qty: 1, Offer_Active: true },
  { Item_Code: "PTFR-0600-12-70", Item_Name: "FROOTI PET 600ML", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 600, Case_Pack: 12, MRP: 70, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 560, Purchase_Rate: 500 },
  { Item_Code: "PTFR-1250-6-130", Item_Name: "FROOTI PET 1.25L", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 1250, Case_Pack: 6, MRP: 130, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 520, Purchase_Rate: 465 },
  { Item_Code: "PTFR-2000-6-180", Item_Name: "FROOTI PET 2L", Brand: "Frooti", Packaging_Type: "Pet", Volume_ml: 2000, Case_Pack: 6, MRP: 180, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 720, Purchase_Rate: 645 },
  { Item_Code: "PTAP-0125-48-10", Item_Name: "APY FIZZ PET 125ML", Brand: "Appy Fizz", Packaging_Type: "Pet", Volume_ml: 125, Case_Pack: 48, MRP: 10, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 410, Purchase_Rate: 365, Offer_Buy_Qty: 10, Offer_Free_Qty: 1, Offer_Active: true },
  { Item_Code: "PTAP-0250-24-20", Item_Name: "APY FIZZ PET 250ML", Brand: "Appy Fizz", Packaging_Type: "Pet", Volume_ml: 250, Case_Pack: 24, MRP: 20, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 390, Purchase_Rate: 350 },
  { Item_Code: "PTAP-0600-12-55", Item_Name: "APY FIZZ PET 600ML", Brand: "Appy Fizz", Packaging_Type: "Pet", Volume_ml: 600, Case_Pack: 12, MRP: 55, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 450, Purchase_Rate: 400 },
  { Item_Code: "PTAP-1250-6-100", Item_Name: "APY FIZZ PET 1.25L", Brand: "Appy Fizz", Packaging_Type: "Pet", Volume_ml: 1250, Case_Pack: 6, MRP: 100, GST_Percent: 12, HSN_Code: "22021010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 420, Purchase_Rate: 375 },
  { Item_Code: "PTSM-0250-24-15", Item_Name: "SMOODH CHOCO 250ML", Brand: "Smoodh", Packaging_Type: "Pet", Volume_ml: 250, Case_Pack: 24, MRP: 15, GST_Percent: 12, HSN_Code: "22029920", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 260, Purchase_Rate: 235 },
  { Item_Code: "PTSM-0200-24-15", Item_Name: "SMOODH COFFEE 200ML", Brand: "Smoodh", Packaging_Type: "Pet", Volume_ml: 200, Case_Pack: 24, MRP: 15, GST_Percent: 12, HSN_Code: "22029920", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 250, Purchase_Rate: 225 },
  { Item_Code: "PTBA-0500-12-15", Item_Name: "BAILEYS 500ML", Brand: "Bailey", Packaging_Type: "Pet", Volume_ml: 500, Case_Pack: 12, MRP: 15, GST_Percent: 18, HSN_Code: "22011010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 120, Purchase_Rate: 108 },
  { Item_Code: "PTBA-1000-12-20", Item_Name: "BAILEYS 1L", Brand: "Bailey", Packaging_Type: "Pet", Volume_ml: 1000, Case_Pack: 12, MRP: 20, GST_Percent: 18, HSN_Code: "22011010", Supplier_Code: "SUP001", Sale_Rate_Wholesale: 160, Purchase_Rate: 145 },
  { Item_Code: "PTDH-0200-24-12", Item_Name: "DHARIWAL 200ML", Brand: "Dhariwal", Packaging_Type: "Pet", Volume_ml: 200, Case_Pack: 24, MRP: 12, GST_Percent: 18, HSN_Code: "22011010", Supplier_Code: "SUP002", Sale_Rate_Wholesale: 195, Purchase_Rate: 175 },
  { Item_Code: "PTDH-0500-12-18", Item_Name: "DHARIWAL 500ML", Brand: "Dhariwal", Packaging_Type: "Pet", Volume_ml: 500, Case_Pack: 12, MRP: 18, GST_Percent: 18, HSN_Code: "22011010", Supplier_Code: "SUP002", Sale_Rate_Wholesale: 140, Purchase_Rate: 125 },
  { Item_Code: "PTDH-1000-6-25", Item_Name: "DHARIWAL 1L", Brand: "Dhariwal", Packaging_Type: "Pet", Volume_ml: 1000, Case_Pack: 6, MRP: 25, GST_Percent: 18, HSN_Code: "22011010", Supplier_Code: "SUP002", Sale_Rate_Wholesale: 95, Purchase_Rate: 85 },
];

export const CUSTOMERS: Customer[] = [
  { Customer_Code: "101", Customer_Name: "Shree Krishna General Store", Beat: "Sinhgad", Contact: "9876543210", Credit_Limit: 5000, GST_Number: "27AABCU9603R1ZM", Postal_Address: "Shop 12, Sinhgad Road, Pune 411030" },
  { Customer_Code: "102", Customer_Name: "Balaji Provisions", Beat: "Sinhgad", Contact: "9876543211", Credit_Limit: 8000, GST_Number: "27AADCB2230M1ZP", Postal_Address: "Near ST Stand, Sinhgad Base, Pune 411030" },
  { Customer_Code: "103", Customer_Name: "Jai Maharashtra Kirana", Beat: "Purandar", Contact: "9876543212", Credit_Limit: 3000, GST_Number: "27AAACU8123A1Z2", Postal_Address: "Main Bazar, Narayanpur, Pune 411014" },
  { Customer_Code: "104", Customer_Name: "Om Sai Dairy & Cold Drink", Beat: "Purandar", Contact: "9876543213", Credit_Limit: 6000, GST_Number: "27AABCT1234R1Z5", Postal_Address: "Moshi Toll Naka, Pune 412105" },
  { Customer_Code: "105", Customer_Name: "Khandoba Mart", Beat: "Rajgad", Contact: "9876543214", Credit_Limit: 4500, GST_Number: "27AAAFZ2233C1ZK", Postal_Address: "Rajgad Fort Road, Velhe, Pune 411029" },
  { Customer_Code: "106", Customer_Name: "Swami Samarth Wholesale", Beat: "Rajgad", Contact: "9876543215", Credit_Limit: 10000, GST_Number: "27AABCU2234R1ZM", Postal_Address: "Bhor Ghat Road, Bhor, Pune 412206" },
  { Customer_Code: "107", Customer_Name: "Ganesh Cold Storage", Beat: "Counter", Contact: "9876543216", Credit_Limit: 0, GST_Number: "27AABCU1234R1ZM", Postal_Address: "Main Warehouse, PCNTDA, Pune 411019" },
  { Customer_Code: "108", Customer_Name: "SaiBaba Juice Corner", Beat: "Sinhgad", Contact: "9876543217", Credit_Limit: 2500, GST_Number: "27AABCU2235R1ZM", Postal_Address: "Warje Malwadi, Pune 411058" },
  { Customer_Code: "109", Customer_Name: "Pravin Pan Bhandar", Beat: "Purandar", Contact: "9876543218", Credit_Limit: 2000, GST_Number: "27AABCU2236R1ZM", Postal_Address: "Chakan Road, Rajgurunagar, Pune 410505" },
  { Customer_Code: "110", Customer_Name: "Hotel Rajdhani", Beat: "Rajgad", Contact: "9876543219", Credit_Limit: 7500, GST_Number: "27AABCU2237R1ZM", Postal_Address: "Bhor Road, Pune 412206" },
];

export const SUPPLIERS: Supplier[] = [
  { Supplier_Code: "SUP001", Supplier_Name: "Parle Agro Pvt Ltd", Lead_Times: "2-3 Days", Contact: "022-4218 0200", Email: "orders@parleagro.com", Address: "Parle Agro House, Off Western Express Highway, Sahar-Chakala Road, Andheri (E), Mumbai 400 099" },
  { Supplier_Code: "SUP002", Supplier_Name: "Dhariwal Industries Pvt Ltd", Lead_Times: "1-2 Days", Contact: "020-2741 8200", Email: "supply@dhariwal.com", Address: "Dhariwal House, 15/B/1, Hadapsar Industrial Estate, Pune 411 013" },
  { Supplier_Code: "SUP003", Supplier_Name: "Coca-Cola India", Lead_Times: "3-4 Days", Contact: "011-4676 5555", Email: "orders@cocacola.com", Address: "Coca-Cola India Pvt Ltd, One Horizon Center, Golf Course Road, Gurugram 122002" },
];

export const RATES_OVERRIDES: RatesOverride[] = [
  { CustomerCode: "106", PricingOverrides: { "PTFR-0330-24-40": 600, "PTFR-0200-24-20": 370 } },
  { CustomerCode: "107", PricingOverrides: { "PTBA-1000-12-20": 150, "PTBA-0500-12-15": 115 } },
  { CustomerCode: "110", PricingOverrides: { "PTFR-1250-6-130": 500, "PTAP-1250-6-100": 400 } },
];
