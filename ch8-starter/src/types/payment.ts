// Base Interface: โครงสร้างพื้นฐานของการชำระเงิน
export interface BasePayment<TType extends string, TMetadata = undefined> {
  type: TType;
  amount: number;
  metadata: TMetadata;
}

// Payment Types: ประเภทการชำระเงินที่ผ่านการ Validate แล้ว

// --- เงินสด ---
export type Cash = BasePayment<'cash', undefined>

// --- บัตรเครดิต ---
export interface CreditCardMetadata {
  cardNumber: string
  cardHolderName: string
}
export type CreditCard = BasePayment<'creditcard', CreditCardMetadata>

// --- โอนผ่านธนาคาร ---
export interface OnlineBankingMetadata {
  accountNumber: string
  bankName: string   
}
export type OnlineBanking = BasePayment<'onlinebanking', OnlineBankingMetadata>

// Union Type: รวมทุกประเภทการชำระเงิน
export type AllPayments = Cash | CreditCard | OnlineBanking

// Form Type: ข้อมูลดิบจากฟอร์ม (ก่อน Validate)
export type AllPaymentsForm = {
    type: string
    amount: string
    metadata: Partial<CreditCardMetadata | OnlineBankingMetadata>
}
