# Mini Workshop: ตู้ซื้อของอัตโนมัติ (Vending Machine)

โปรเจกต์จำลองระบบจ่ายเงินในตู้ซื้อของอัตโนมัติ เขียนด้วย **TypeScript**

---

## 📌 Vending Machine v1 (`vending_v1.ts`)

ระบบตู้ซื้อของอัตโนมัติเวอร์ชันแรก รองรับการจ่ายเงินด้วย **เงินสด** เพียงอย่างเดียว

### 📋 ความต้องการของระบบ

- ได้รับการไว้วานให้ทำระบบจ่ายเงินในตู้ซื้อของอัตโนมัติ
- ขายสินค้าชิ้นเดียว คือ **น้ำดื่มขวด**
- ถ้าสินค้าหมด ให้ปิดการทำรายการ
- การจ่ายเงินด้วย **เงินสด (Cash)** เท่านั้น
- ผู้ใช้สามารถใส่เงินในตู้ได้ **หลายครั้ง**
- เมื่อใส่เงินเสร็จสามารถ **ถอนเงิน** ได้
- ถ้าเงินทอนไม่พอให้ **ยกเลิกรายการ**
- เมื่อขั้นตอนการชำระเงินเสร็จสิ้น จึงจะสามารถจ่ายสินค้าได้

### 🏗️ โครงสร้างคลาส

#### `Cashpayment`
| Method | คำอธิบาย |
|---|---|
| `addMoney(cash)` | เพิ่มเงินสดเข้าตู้ สามารถเรียกได้หลายครั้ง |
| `getAmount()` | ดึงยอดเงินรวมที่หยอดเข้ามาทั้งหมด |

#### `VendingMachine`
| Method | คำอธิบาย |
|---|---|
| `constructor(price, amount, totalcash)` | กำหนดราคาสินค้า, จำนวนสต็อก, เงินทอนในตู้ |
| `IsOutofStock()` | ตรวจสอบว่าสินค้าหมดหรือไม่ |
| `IsPayEnogh(amount)` | ตรวจสอบว่าจ่ายเงินพอหรือไม่ |
| `calculateChange(amount)` | คำนวณเงินทอน |
| `IsEnoghCashe(amount)` | ตรวจสอบว่าเงินทอนในตู้พอหรือไม่ |
| `pay(payment)` | ดำเนินการชำระเงินและส่งมอบสินค้า |

### ▶️ ตัวอย่างการใช้งาน

```typescript
const vendingMachine = new VendingMachine(10, 2, 5); // ราคา 10 บาท, สต็อก 2 ชิ้น, เงินทอน 5 บาท
const cashpayment = new Cashpayment();
cashpayment.addMoney(5);   // หยอดเงิน 5 บาท
cashpayment.addMoney(10);  // หยอดเงิน 10 บาท (รวม 15 บาท)

const result = vendingMachine.pay(cashpayment);
console.log(result); // "ทอนเงิน: 5 บาท กำลังส่งมอบสินค้า"
```

---
## 📌 Vending Machine v2 (`vending_v2.ts`)

เวอร์ชัน 2 ปรับปรุงจาก v1 โดยนำหลัก **OOP (Abstract Class)** มาใช้ และเพิ่มช่องทางการชำระเงินผ่าน **QR Code**

### 🆕 สิ่งที่เพิ่มเติมจาก v1

- ใช้ **Abstract Class** `Payment` เป็นแม่แบบสำหรับระบบชำระเงิน
- เพิ่มการจ่ายเงินผ่าน **QR Code** (`QRcodepayment`)
- แยกคลาสการจ่ายเงินสดเป็น `CashPayment` ที่สืบทอดจาก `Payment`
- ตรวจสอบประเภทการชำระเงิน (เงินสด / QR Code) เพื่อจัดการเงินทอนอัตโนมัติ
- จำลองผลลัพธ์การชำระเงิน QR Code ผ่าน **API** (ใช้ random ~60% สำเร็จ)

### 🏗️ โครงสร้างคลาส

#### `Payment` (Abstract Class)
| Property / Method | คำอธิบาย |
|---|---|
| `amount` | ยอดเงินที่ชำระ |
| `isCash` | flag บอกว่าเป็นเงินสดหรือไม่ |
| `getAmount()` | ดึงยอดเงินที่ชำระ |
| `isCashPayment()` | ตรวจสอบว่าเป็นการจ่ายเงินสดหรือไม่ |
| `isPaymentSuccess()` | *(abstract)* ตรวจสอบว่าการชำระเงินสำเร็จหรือไม่ |

#### `CashPayment` (extends Payment)
| Method | คำอธิบาย |
|---|---|
| `constructor()` | กำหนด `isCash = true` |
| `addMoney(cash)` | เพิ่มเงินสดเข้าตู้ สามารถเรียกได้หลายครั้ง |
| `isPaymentSuccess()` | คืนค่า `true` เสมอ (เงินสดสำเร็จทันที) |

#### `QRcodepayment` (extends Payment)
| Method | คำอธิบาย |
|---|---|
| `payWithQRcode(amount)` | กำหนดยอดเงินที่ต้องชำระผ่าน QR Code |
| `isPaymentSuccess()` | จำลอง API ด้วย random ถ้าค่า > 3 ถือว่าสำเร็จ (~60%) |

#### `VendingMachine`
| Method | คำอธิบาย |
|---|---|
| `constructor(price, amount, totalcash)` | กำหนดราคาสินค้า, จำนวนสต็อก, เงินทอนในตู้ |
| `IsOutofStock()` | ตรวจสอบว่าสินค้าหมดหรือไม่ |
| `IsPayEnogh(amount)` | ตรวจสอบว่าจ่ายเงินพอหรือไม่ |
| `calculateChange(amount)` | คำนวณเงินทอน |
| `IsEnoghCashe(amount)` | ตรวจสอบว่าเงินทอนในตู้พอหรือไม่ (เฉพาะเงินสด) |
| `pay(payment)` | ดำเนินการชำระเงิน รองรับทั้งเงินสดและ QR Code |

### ▶️ ตัวอย่างการใช้งาน

**จ่ายด้วยเงินสด:**
```typescript
const vendingMachine = new VendingMachine(10, 2, 5);
const cashpayment = new CashPayment();
cashpayment.addMoney(5);   // หยอดเงิน 5 บาท
cashpayment.addMoney(10);  // หยอดเงิน 10 บาท (รวม 15 บาท)

const result = vendingMachine.pay(cashpayment);
console.log(result); // "ทอนเงิน: 5 บาท กำลังส่งมอบสินค้า"
```

**จ่ายด้วย QR Code:**
```typescript
const qrCodepayment = new QRcodepayment();
qrCodepayment.payWithQRcode(10); // ชำระ 10 บาทผ่าน QR Code

const result = vendingMachine.pay(qrCodepayment);
console.log(result); // "ชำระเงินในรูปแบบ QR code จำนวน 10 บาทกำลังส่งมอบสินค้า...."
```

### 📊 Class Diagram

```
┌─────────────────────────────┐
│    Payment (Abstract)       │
├─────────────────────────────┤
│ # amount: number            │
│ # isCash: boolean           │
├─────────────────────────────┤
│ + getAmount(): number       │
│ + isCashPayment(): boolean  │
│ + isPaymentSuccess(): bool  │ ← abstract
└──────────┬──────────────────┘
           │ extends
     ┌─────┴──────┐
     ▼            ▼
┌──────────┐ ┌──────────────┐
│CashPayment│ │QRcodepayment │
├──────────┤ ├──────────────┤
│+addMoney()│ │+payWithQR()  │
│+isPayment │ │+isPayment    │
│ Success() │ │ Success()    │
└──────────┘ └──────────────┘
```

---

## 🔄 ความแตกต่างระหว่าง v1 กับ v2

| หัวข้อ | v1 | v2 |
|---|---|---|
| ช่องทางชำระเงิน | เงินสดเท่านั้น | เงินสด + QR Code |
| โครงสร้างคลาส | `Cashpayment` แยกเดี่ยว | ใช้ Abstract Class `Payment` เป็นแม่แบบ |
| การตรวจสอบชำระเงิน | ไม่มี | มี `isPaymentSuccess()` จำลอง API |
| หลักการ OOP | พื้นฐาน | Abstraction + Inheritance |
| การทอนเงิน | ทอนทุกกรณี | ทอนเฉพาะเงินสด (QR Code ไม่ต้องทอน) |

---
README โดย GEMINI
