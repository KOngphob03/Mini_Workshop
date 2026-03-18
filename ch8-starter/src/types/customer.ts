import { AllPayments, AllPaymentsForm } from "./payment";

// Customer: ข้อมูลลูกค้าที่ผ่านการ Validate แล้ว
export interface Customer {
    name: string;
    payments: AllPayments;
    isVerified: boolean;
}

// CustomerForm: ข้อมูลดิบจากฟอร์ม (ก่อน Validate)
export interface CustomerForm {
    name: string;
    payments: AllPaymentsForm;
    isVerified: boolean;
}