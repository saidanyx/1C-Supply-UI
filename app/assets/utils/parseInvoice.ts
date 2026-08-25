import type { ParsedInvoice, InvoiceData  } from "~/components/types/invoiceTypes";

export const getParsedFiles = async (files: File[]): Promise<ParsedInvoice[] | null> => {
    const parsedInvoices = <ParsedInvoice[]>([])
    let count = 0

    for (let file of files) {
        const formData = new FormData()
        
        count = count + 1
        formData.append("file", file)

        const result = await $fetch("/api/parse", {
            method: "POST",
            body: formData
        })

        if (!result.data) {
            return null
        }

        let emptyFields = (Object.keys(result.data) as (keyof InvoiceData)[]).filter(key => result.data[key] == null)

        parsedInvoices.push({id: count, fileName: file.name, data: result.data, emptyFields: emptyFields})
    }

    return parsedInvoices
}