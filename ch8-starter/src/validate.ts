// Imports
import { Customer, CustomerForm } from "./types/customer";
import { AllPayments, AllPaymentsForm, CreditCardMetadata, OnlineBankingMetadata } from "./types/payment";

// Helper: ตรวจสอบค่าว่าง (Assertion Function)
export function assertNonEmpty(condition: unknown, message: string): asserts condition {
    if (condition === null || condition === undefined || condition === "") {
        throw new Error(message)
    }
}

// ตรวจสอบข้อมูลลูกค้า (Customer Validation)
export function validateCustomer(customer: CustomerForm): Customer {
    if (!customer.name) {
        throw new Error('Name is required')
    }
    
    if (customer.isVerified === undefined) {
        throw new Error('Verified is required')
    }
    
    return {
        name: customer.name,
        isVerified: customer.isVerified,
        payments: validatePayment(customer.payments)
    }
}  

// ตรวจสอบข้อมูลการชำระเงิน (Payment Validation)
export function validatePayment(payment: AllPaymentsForm): AllPayments {

    // --- ตรวจสอบฟิลด์พื้นฐาน ---
    assertNonEmpty(payment.type, "Payment type is required")
    assertNonEmpty(payment.amount, "Payment amount is required")
    
    const amount = Number(payment.amount)
    if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid payment amount")
    }

    // --- เงินสด (Cash) ---
    if (payment.type === "Cash") {
        return {
            amount: amount,
            type: "cash",
            metadata: undefined
        }

    // --- โอนผ่านธนาคาร (Online Banking) ---
    } else if (payment.type === "OnlineBanking") {
        const metadata = payment.metadata as Partial<OnlineBankingMetadata>;
        
        assertNonEmpty(metadata?.accountNumber, "Account number is required")
        assertNonEmpty(metadata?.bankName, "Bank name is required")
        
        return {
            amount: amount,
            type: "onlinebanking",
            metadata: {
                accountNumber: metadata.accountNumber,
                bankName: metadata.bankName
            }
        }

    // --- บัตรเครดิต (Credit Card) ---
    } else if (payment.type === "CreditCard") {
        const metadata = payment.metadata as Partial<CreditCardMetadata>;

        assertNonEmpty(metadata?.cardNumber, "Card number is required")
        assertNonEmpty(metadata?.cardHolderName, "Card holder name is required")
        
        return {
            amount: amount,
            type: "creditcard",
            metadata: {
                cardNumber: metadata.cardNumber,
                cardHolderName: metadata.cardHolderName
            }
        }
    }
    
    throw new Error("Invalid payment method")
}