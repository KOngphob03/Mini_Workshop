import './style.css';
console.log('hello world from Vite');

//Mini-workshop:สร้างตู้ซื้อของอัตโนมัติ v2 

abstract class Payment{
    protected amount: number = 0;
    protected isCash: boolean = false;
    public getAmount(): number{
        return this.amount;
    }

    public isCashPayment(): boolean{
        return this.isCash;
    }

    public abstract isPaymentSuccess(): boolean;
    
}

class CashPayment extends Payment{

    constructor(){
        super();
        this.isCash = true;
    }

    public addMoney(cash: number){
        this.amount += cash;
        console.log(`ได้รับเงินมา${cash}บาท`)
    }

    public isPaymentSuccess(): boolean{
        return true;
    }
}
 
// คลาส QRcodepayment สืบทอดมาจาก Payment ใช้สำหรับการชำระเงินผ่าน QR code
// ไม่ได้ใช้เงินสด ดังนั้น isCash จะเป็น false (ค่า default จาก abstract class)
class QRcodepayment extends Payment{

    // method สำหรับชำระเงินผ่าน QR code
    // รับจำนวนเงินที่ต้องจ่ายแล้วกำหนดให้กับ amount
    public payWithQRcode(amount: number): void{
        this.amount = amount;
    }

    // ตรวจสอบว่าการชำระเงินสำเร็จหรือไม่
    // จำลองการเรียก API โดยใช้ random ถ้าค่ามากกว่า 3 ถือว่าสำเร็จ (ประมาณ 60% สำเร็จ)
    public isPaymentSuccess(): boolean{
        //api จำลองการส่งเงิน
        const random = Math.floor(Math.random() * 10);
        return random > 3;
    }
}

class VendingMachine {

    constructor(private price: number,private amount: number,private totalcash: number){};
    
    private IsOutofStock(): boolean{
        return this.amount <=0;
    }

    private IsPayEnogh(amount: number): boolean{
        return this.price > amount;
    }

    private calculateChange(amount: number): number{
        return amount - this.price;
    }

    private IsEnoghCashe(amount: number){
        return this.totalcash >= this.calculateChange(amount);
    }

    public pay(payment: Payment){
        if(this.IsOutofStock()){
            throw new Error("สินค้าหมด");
        }

        if(this.IsPayEnogh(payment.getAmount())){
            throw new Error("จ่ายเงินไม่พอ");
        }

        if(!this.IsEnoghCashe(payment.getAmount()) && payment.isCashPayment()){
            throw new Error("เงินไม่พอ");
        }

        // ตรวจสอบว่าการชำระเงินสำเร็จหรือไม่ (ทั้งเงินสดและ QR code)
        // กรณี QR code จะใช้การ random จำลอง API ถ้าไม่สำเร็จจะ throw error
        if(!payment.isPaymentSuccess()){
            throw new Error("การชำระเงินไม่สำเร็จ");
        }

        if(payment.isCashPayment()){
            const change = this.calculateChange(payment.getAmount());

            if(change > 0){
                return `ทอนเงิน: ${change} บาท กำลังส่งมอบสินค้า`;
            }

            return `กำลังส่งมอบสินค้า....`;
        }
        // กรณีจ่ายด้วย QR code ไม่ต้องทอนเงิน แสดงยอดที่ชำระแล้วส่งมอบสินค้า
        return `ชำระเงินในรูปแบบ QR code จำนวน ${payment.getAmount()} บาทกำลังส่งมอบสินค้า....`;
    }
}

const vendingMachine = new VendingMachine(10,2,5);
const cashpayment = new CashPayment();
cashpayment.addMoney(5);
cashpayment.addMoney(10);

// สร้าง instance ของ QRcodepayment สำหรับจ่ายเงินผ่าน QR code
const qrCodepayment = new QRcodepayment();
// กำหนดยอดชำระ 10 บาท ผ่าน QR code
qrCodepayment.payWithQRcode(10);

// เรียกใช้ method pay โดยส่ง qrCodepayment เข้าไป
// ระบบจะตรวจสอบสต็อก, ยอดเงิน, และจำลองผลการชำระเงินผ่าน API
const result = vendingMachine.pay(qrCodepayment);
console.log(`print VendingMachine result`,result);