// Imports
import "./css/table.css";
import "./css/style.css";
import { Customer, CustomerForm } from "./types/customer";
import { setupTable } from "./table";
import { validateCustomer } from "./validate";

// แสดงข้อความแจ้งเตือน (Success / Error)
function showMessage(message:string ,type:"success"|"error"){
  const messageElement = document.querySelector<HTMLDivElement>("#message")!
  messageElement.innerHTML = message
  messageElement.classList.remove("hide","success","error")
  messageElement.classList.add(type)
}

// ตั้งค่าฟอร์มเพิ่มลูกค้า
function setupForm(formElement: HTMLFormElement, customers: Customer[], callback: () => void) {

  // --- ดึง DOM Elements ---
  const paymentTypeSelect = document.querySelector<HTMLSelectElement>("#paymentType")!
  const creditCardMetadata = document.querySelector<HTMLDivElement>("#creditCardMetadata")!
  const onlineBankingMetadata = document.querySelector<HTMLDivElement>("#onlineBankingMetadata")!

  // --- Event: เปลี่ยนวิธีชำระเงิน (สลับ Dropdown) ---
  formElement.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement
    
    if (target.value === "Cash") {
      creditCardMetadata.classList.add("hide")
      onlineBankingMetadata.classList.add("hide")
      
    } else if (target.value === "CreditCard") {
      creditCardMetadata.classList.remove("hide")
      onlineBankingMetadata.classList.add("hide")
      
    } else if (target.value === "OnlineBanking") {
      creditCardMetadata.classList.add("hide")
      onlineBankingMetadata.classList.remove("hide")
    }
  })

  // --- Event: กดปุ่ม Submit ฟอร์ม ---
  formElement.addEventListener("submit", (event) => {
    event.preventDefault()

    try {
      // สร้าง Object ข้อมูลลูกค้าจากฟอร์ม
      const customerForm: CustomerForm = {
        name: document.querySelector<HTMLInputElement>("#customerName")!.value,
        isVerified: document.querySelector<HTMLInputElement>("#isVerified")!.checked,
        payments: {
          type: paymentTypeSelect.value,
          amount: document.querySelector<HTMLInputElement>("#amount")!.value,
          metadata: {
            cardNumber: document.querySelector<HTMLInputElement>("#cardNumber")!.value,
            cardHolderName: document.querySelector<HTMLInputElement>("#cardHolderName")!.value,
            accountNumber: document.querySelector<HTMLInputElement>("#accountNumber")!.value,
            bankName: document.querySelector<HTMLInputElement>("#bankName")!.value,
          }
        }
      }

      // Validate แล้วเพิ่มลูกค้าเข้า Array
      const validatedCustomer = validateCustomer(customerForm)
      customers.push(validatedCustomer)

      // เรียก callback เพื่ออัปเดตตาราง
      callback()

      showMessage("User added successfully", "success")
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        showMessage(error.message, "error")
      } else {
        showMessage(String(error), "error")
      }
    }
  })
}

// ฟังก์ชันหลัก: เริ่มต้นแอปพลิเคชัน
export function setup(){

  // --- ข้อมูลเริ่มต้น ---
  const customers : Customer []= []
  customers.push({
    name:"John Doe",
    payments:{
      type:"cash",
      amount:100,
      metadata:undefined,
    },
    isVerified: true,
  })

  // --- ตั้งค่าตาราง ---
  const tableElement = document.querySelector<HTMLTableElement>("#paymentTable")!
  const tableColumns =[
  "Customer Name",
  "Amount",
  "Payment Method",
  "Metadata",
  "Verified",
  ]
  setupTable(tableElement, tableColumns, customers);

  // --- ตั้งค่าฟอร์ม ---
  const formElement = document.querySelector<HTMLFormElement>("#addCustomerForm")!
  setupForm(formElement,customers,()=>setupTable(tableElement, tableColumns, customers));
}

// ========================
// เรียกใช้งาน
// ========================
setup();