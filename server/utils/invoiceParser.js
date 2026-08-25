import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const XLSX = require("xlsx")

const AMOUNT = "\\d{1,3}(?:[\\s\\u00A0]?\\d{3})*(?:[.,]\\d{2})?"

function parseAmount(str) {
    if (!str) return null

    return parseFloat(
        str
            .replace(/[\s\u00A0]/g, "")
            .replace(",", ".")
    )
}

function normalizeText(text) {
    return text
        .replace(/\u00A0/g, " ")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n+/g, "\n")
        .trim()
}

function normalizeDate(str) {
    const months = {
        января: "01",
        февраля: "02",
        марта: "03",
        апреля: "04",
        мая: "05",
        июня: "06",
        июля: "07",
        августа: "08",
        сентября: "09",
        октября: "10",
        ноября: "11",
        декабря: "12",
    }

    let match = str.match(/(\d{1,2})\.(\d{2})\.(\d{4})/)

    if (match) {
        return `${match[3]}-${match[2]}-${match[1].padStart(2, "0")}`
    }

    match = str.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i)

    if (match && months[match[2].toLowerCase()]) {
        return `${match[3]}-${months[match[2].toLowerCase()]}-${match[1].padStart(2, "0")}`
    }

    return str
}

function parseInvoiceText(text) {
    const rawText = normalizeText(text)
    const normalizedText = rawText.replace(/\s+/g, " ").trim()

    const result = {
        invoiceNumber: null,
        invoiceDate: null,

        supplierINN: null,
        supplierKPP: null,
        supplierName: null,

        buyerINN: null,
        buyerKPP: null,

        bik: null,
        bankName: null,
        corrAccount: null,
        account: null,

        total: null,
        vat: null,

        items: [],
    }

    const header = normalizedText.match(
        /Счет\s+(?:на\s+оплату\s+)?№?\s*([\wА-Яа-яЁё\-\/]+)\s+от\s+(\d{1,2})\s+([а-яё]+)\s+(\d{4})\s*г?\.?/i
    )

    if (header) {
        result.invoiceNumber = header[1]
        result.invoiceDate = normalizeDate(
            `${header[2]} ${header[3]} ${header[4]}`
        )
    }

    if (!result.invoiceNumber) {
        const headerShort = normalizedText.match(
            /Счет\s+(?:на\s+оплату\s+)?№?\s*([\wА-Яа-яЁё\-\/]+)\s+от\s+(\d{1,2}\.\d{2}\.\d{4})/i
        )

        if (headerShort) {
            result.invoiceNumber = headerShort[1]
            result.invoiceDate = normalizeDate(headerShort[2])
        }
    }

    const bik = normalizedText.match(
        /БИК\s*:?\s*(\d{9})/i
    )

    if (bik) {
        result.bik = bik[1]
    }

    const corr = normalizedText.match(
        /\b(30101\d{15})\b/
    )

    if (corr) {
        result.corrAccount = corr[1]
    }

    const accounts = normalizedText.match(
        /\b(40[5-8]\d{17})\b/g
    )

    if (accounts) {
        result.account = accounts[0]
    }

    const supplier = normalizedText.match(
        /Поставщик\s+(.+?)\s*,?\s*ИНН\s*(\d{10,12})\s*,?\s*КПП\s*(?:(?:\(исполнитель\)\s*:\s*)?(?:\(заказчик\)\s*:\s*)?)(\d{9})/i
    )

    if (supplier) {
        result.supplierName = supplier[1].trim()
        result.supplierINN = supplier[2]
        result.supplierKPP = supplier[3]
    }

    if (!result.supplierINN) {
        const supplierFallback = normalizedText.match(
            /Поставщик\s+(.+?)\s*,?\s*ИНН\s*(\d{10,12})/i
        )

        if (supplierFallback) {
            result.supplierName = supplierFallback[1].trim()
            result.supplierINN = supplierFallback[2]
        }
    }

    if (!result.supplierKPP && result.supplierINN) {
        const supplierKppFallback = normalizedText.match(
            /Поставщик[\s\S]*?КПП[\s\S]*?(\d{9})/i
        )

        if (supplierKppFallback) {
            result.supplierKPP = supplierKppFallback[1]
        }
    }

    const buyer = normalizedText.match(
        /Покупатель\s+(.+?)\s*,?\s*ИНН\s*(\d{10,12})\s*,?\s*КПП\s*(\d{9})/i
    )

    if (buyer) {
        result.buyerINN = buyer[2]
        result.buyerKPP = buyer[3]
    }

    if (!result.supplierINN) {
        const inn = normalizedText.match(
            /ИНН\s*:?\s*(\d{10,12})/i
        )

        if (inn) {
            result.supplierINN = inn[1]
        }
    }

    if (bik) {
        const bankMatch = normalizedText.match(
            /(.+?)\s+БИК\s+\d{9}/i
        )

        if (bankMatch) {
            result.bankName = bankMatch[1].trim()
        }
    }

    const total =
        normalizedText.match(
            new RegExp(
                `Итого\\s+с\\s+НДС\\s*:?\\s*(${AMOUNT})`,
                "i"
            )
        ) ||
        normalizedText.match(
            new RegExp(
                `Всего\\s+к\\s+оплате\\s*:?\\s*(${AMOUNT})`,
                "i"
            )
        ) ||
        normalizedText.match(
            new RegExp(
                `Итого\\s*:?\\s*(${AMOUNT})`,
                "i"
            )
        )

    if (total) {
        result.total = parseAmount(total[1])
    }

    const vat = normalizedText.match(
        /НДС\s*\(?\s*\d{1,2}%?\s*\)?\s*:?\s*(\d{1,3}(?:[\s\u00A0]?\d{3})*(?:[.,]\d{2})?)/i
    )

    if (vat) {
        result.vat = parseAmount(vat[1])
    }

    const itemRe = new RegExp(
        `^(\\d{1,3})\\s*([\\wА-Яа-яЁё-]+)?\\s+(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*(шт|уп|кг|м|л|компл|пар|усл)\\.?\\s*(${AMOUNT})\\s+(${AMOUNT})\\s*$`,
        "gim"
    )

    let match

    while ((match = itemRe.exec(rawText)) !== null) {
        result.items.push({
            number: parseInt(match[1], 10),
            code: match[2] || null,
            name: match[3].trim(),
            quantity: parseFloat(match[4].replace(",", ".")),
            unit: match[5],
            price: parseAmount(match[6]),
            sum: parseAmount(match[7]),
        })
    }

    if (result.items.length === 0) {
        const codeMatch = normalizedText.match(
            /\b(?:НФ|НФ-)[A-ZА-ЯЁ0-9-]*\d+\b/i
        )

        const itemMatch = normalizedText.match(
            /НФ-\d+\s+(\d+(?:[.,]\d+)?)\s+(шт|уп|кг|м|л|компл|пар|усл)\.?\s+([\d\s\u00A0]+(?:[.,]\d{2}))\s+([\d\s\u00A0]+(?:[.,]\d{2}))/i
        )

        if (itemMatch) {
            let name = null

            const nameMatch = normalizedText.match(
                /(ЛДСП\s+.+?)\s+\d+\s+шт/i
            )

            if (nameMatch) {
                name = nameMatch[1].trim()
            }

            result.items.push({
                number: 1,
                code: codeMatch ? codeMatch[0] : null,
                name,
                quantity: parseFloat(
                    itemMatch[1].replace(",", ".")
                ),
                unit: itemMatch[2],
                price: parseAmount(itemMatch[3]),
                sum: parseAmount(itemMatch[4]),
            })
        }
    }

    return result
}

async function parsePdfInvoice(buffer) {
    const { extractText } = await import("unpdf")

    const { text } = await extractText(
        new Uint8Array(buffer),
        {
            mergePages: true,
        }
    )

    return parseInvoiceText(text)
}

function parseExcelInvoice(buffer) {
    const workbook = XLSX.read(buffer, {
        type: "buffer",
    })

    const lines = []

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName]

        if (!sheet) continue

        const rows = XLSX.utils.sheet_to_json(
            sheet,
            {
                header: 1,
                raw: false,
            }
        )

        for (const row of rows) {
            const line = row
                .filter(cell => cell != null && cell !== "")
                .join(" ")
                .trim()

            if (line) {
                lines.push(line)
            }
        }
    }

    return parseInvoiceText(
        lines.join("\n")
    )
}

async function parseInvoice(buffer) {
    const signature = buffer
        .slice(0, 4)
        .toString("latin1")

    if (signature.startsWith("%PDF")) {
        return parsePdfInvoice(buffer)
    }

    if (
        signature.startsWith("PK") ||
        buffer[0] === 0xd0
    ) {
        return parseExcelInvoice(buffer)
    }

    throw new Error(
        "Неизвестный формат файла: ожидается PDF или Excel"
    )
}

export {
    parseInvoice,
}