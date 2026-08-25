interface TableItem {
    Артикул: string
    Номенклатура: string
    Количество: string
    ЕдиницаИзмерения: string
}

interface OrderData {
    UUID: string
    Table: TableItem[]
    Action: string
}

export const useOrderData = () => {
    return useState<OrderData | null>('orderData', () => ({
        UUID: '',
        Table: [],
        Action: ''
    }))
}