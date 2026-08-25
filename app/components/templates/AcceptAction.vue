<template>
    <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-balance">Заказ поставщику</h1>
        <p class="text-sm text-gray-500">Проверьте позиции заказа и подтвердите его</p>
    </header>

    <section class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th class="w-12 px-4 py-3">Артикул</th>
                    <th class="px-4 py-3">Номенклатура</th>
                    <th class="w-24 px-4 py-3 text-right">Кол-во</th>
                    <th class="w-24 px-4 py-3 text-center">Ед.Изм.</th>
                    <th class="w-24 px-4 py-3 text-center">Статус</th>
                </tr>
            </thead>
            <tbody id="items-body" class="divide-y divide-gray-100">
                <tr v-for="item in orderData?.Table" :key="item.Номенклатура" class="hover:bg-gray-50">
                    <td class="px-4 py-3">{{ item.Артикул }}</td>
                    <td class="px-4 py-3">{{ item.Номенклатура }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ item.Количество }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ item.ЕдиницаИзмерения }}</td>
                    <td class="px-4 py-3">
                        <button v-html="CHECK_ICON" class="btn mx-auto flex h-6 w-6 rounded-full overflow-hidden" data-avalible="true"></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

    <SharedFileUpload v-model="fileUpload" />

    <section class="flex flex-col gap-2">
        <label for="comment" class="text-sm font-medium">Комментарий</label>
        <textarea id="comment" rows="4" placeholder="Укажите комментарий к одобрению заказа (необязательно)" class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"></textarea>
    </section>

    <button type="button" id="setup-btn" class="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700">Подтвердить заказ</button>

    <SharedConfirmModal ref="infoModal" @confirm="handleConfirm" />
</template>

<script setup lang="ts">
const CHECK_ICON = `<div class="bg-green-100 text-green-700 flex h-full w-full items-center justify-center"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div>`
const infoModal = ref()

const openModal = () => {
    infoModal.value?.open()
}

const handleConfirm = () => {
    // действие после подтверждения
}


const orderData = useOrderData()

const fileUpload = ref()

const submit = () => {
    const files = fileUpload.value.getFiles()

    console.log(files)
}
</script>