import './style.css';
console.log('hello world from Vite');

//Mini-workshop:สร้างตู้ซื้อของอัตโนมัติ v1

class Cashpayment {
    private amount: number = 0;
    
    public addMoney(cash: number){
        this.amount += cash;
        console.log(`ได้รับเงินมา${cash}บาท`)
    }

    public getAmount(): number{
        return this.amount;
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

    public pay(payment: Cashpayment){
        if(this.IsOutofStock()){
            throw new Error("สินค้าหมด");
        }

        if(this.IsPayEnogh(payment.getAmount())){
            throw new Error("จ่ายเงินไม่พอ");
        }

        if(!this.IsEnoghCashe(payment.getAmount())){
            throw new Error("เงินไม่พอ");
        }

        this.totalcash += this.price;

        const change = this.calculateChange(payment.getAmount());

        if(change > 0){
            return `ทอนเงิน: ${change} บาท กำลังส่งมอบสินค้า`;
        }

        return `กำลังส่งมอบสินค้า....`;
     
    }
}

const vendingMachine = new VendingMachine(10,2,5);
const cashpayment = new Cashpayment();
cashpayment.addMoney(5);
cashpayment.addMoney(10);

const result = vendingMachine.pay(cashpayment);
console.log(`print VendingMachine result`,result);