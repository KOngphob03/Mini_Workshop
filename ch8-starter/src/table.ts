// Imports
import { Customer } from "./types/customer";

// สร้างตาราง (Table Setup)
export function setupTable(
    tableElement: HTMLTableElement,
    columnsHeader: string[],
    customers: Customer[]   
) {
    // ล้างข้อมูลตารางเก่า
    tableElement.innerHTML = "";
    
    // สร้างแถวหัวตาราง (Header Row)
    const headerRow = tableElement.insertRow()
    headerRow.innerHTML = columnsHeader.map(column => `<th>${column}</th>`).join("")

    // แสดงข้อมูลลูกค้าแต่ละคน
    customers.forEach(customer => appendTableRow(tableElement, customer))
}

// เพิ่มแถวข้อมูลลูกค้า (Append Row)
export function appendTableRow(tableElement: HTMLTableElement, customer: Customer) {
    const rowElement = tableElement.insertRow()
    
    const { name, payments, isVerified } = customer
    
    rowElement.innerHTML = `
        <td>${name}</td>
        <td>${payments.amount}</td>
        <td>${payments.type}</td>
        <td>${payments.metadata ? JSON.stringify(payments.metadata) : "-"}</td>
        <td>${isVerified ? "✅" : "❌"}</td>
    `
}