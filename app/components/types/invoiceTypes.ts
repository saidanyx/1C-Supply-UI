export interface ParsedInvoice {
    id: number
    fileName: string
    data: InvoiceData
    emptyFields: (keyof InvoiceData)[]
}

export interface InvoiceData {
    invoiceNumber: string | null
    invoiceDate: string | null
    supplierINN: string | null
    supplierKPP: string | null
    supplierName: string | null
    buyerINN: string | null
    buyerKPP: string | null
    bik: string | null
    bankName: string | null
    corrAccount: string | null
    account: string | null
    total: number | null
    vat: number | null
    items: InvoiceItem[]
}

export interface InvoiceItem {
    number: number
    code: string | null
    name: string | null
    quantity: number | null
    unit: string | null
    price: number | null
    sum: number | null
}

export interface MissingField {
    invoiceId: number
    key: keyof InvoiceData
    label: string
    value: string
}
