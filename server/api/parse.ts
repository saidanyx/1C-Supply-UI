import { parseInvoice } from "../utils/invoiceParser.js"

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)

    const file = formData?.find(item => item.name === "file")

    if (!file?.data) {
        return {
            success: false,
            message: "Файл не загружен",
            data: null,
        }
    }

    const data = await parseInvoice(file.data)

    return {
        success: true,
        message: null,
        data,
    }
})