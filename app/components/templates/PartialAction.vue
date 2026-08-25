<template>
    <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-balance">Заказ поставщику</h1>
        <p class="text-sm text-gray-500">Отметьте в списке позиции, которые не могут быть поставлены. Остальные позиции считаются доступными.</p>
    </header>

    <section class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table class="w-full text-sm">
            <thead >
                <tr class="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th class="w-12 px-4 py-3">Артикул</th>
                    <th class="px-4 py-3">Номенклатура</th>
                    <th class="w-24 px-4 py-3 text-right">Кол-во</th>
                    <th class="w-24 px-4 py-3 text-center">Ед.Изм.</th>
                    <th class="w-24 px-4 py-3 text-center">Статус</th>
                </tr>
            </thead>
            <tbody id="items-body" class="divide-y divide-gray-100">
                <tr ref="tbody" v-for="item in orderData?.Table" :key="item.Номенклатура" class="hover:bg-gray-50">
                    <td class="px-4 py-3">{{ item.Артикул }}</td>
                    <td class="px-4 py-3">{{ item.Номенклатура }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ item.Количество }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ item.ЕдиницаИзмерения }}</td>
                    <td class="px-4 py-3">

                        <button class="btn mx-auto flex h-6 w-6 rounded-full overflow-hidden" @click="available[item.Номенклатура] = !available[item.Номенклатура]">
                            <span v-html="available[item.Номенклатура] ? CHECK_ICON : CROSS_ICON"></span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

    <SharedFileUpload ref="fileUpload" />

    <section class="flex flex-col gap-2">
        <label for="comment" class="text-sm font-medium">Комментарий</label>
        <textarea id="comment" rows="4" placeholder="Укажите комментарий к заказу (необязательно)" class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"></textarea>
    </section>

    <button @click="temp" type="button" class="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700">Подтвердить заказ</button>

    <!-- <SharedConfirmModal ref="infoModal" @confirm="handleConfirm" /> -->

    <SharedMissingFieldsModal :is-open="missingModalOpen" :uncorrectedInvoices="missingModalinvoices" @confirm="missingModalConfirm" />
</template>

<script setup lang="ts">
import type { ParsedInvoice } from '../types/invoiceTypes'
import { getParsedFiles } from '~/assets/utils/parseInvoice'

const allParsedInvoices = ref<ParsedInvoice[]>([])

const temp = async() => {
    allParsedInvoices.value = await getParsedFiles(fileUpload.value.getFiles()) ?? []

    let fatalUncorrectedParsedInvoices = allParsedInvoices?.value.filter(invoice => invoice.data.items.length == 0) 
    // if (fatalUncorrectedParsedInvoices?.length) console.error("FATAL ERROR | ITEMS IS EMPTY") 

    let uncorrectedParsedInvoices = allParsedInvoices?.value.filter(invoice => Object.values(invoice.data).some(field => field == null))

    missingModalOpen.value = true
    missingModalinvoices.value = uncorrectedParsedInvoices
}

const missingModalOpen = ref(false)
const missingModalinvoices = ref<ParsedInvoice[]>([])

const missingModalConfirm = () => {
    let uncorrectedParsedInvoices = allParsedInvoices?.value.filter(invoice => Object.values(invoice.data).some(field => field == null))

    if (uncorrectedParsedInvoices.length) {
        missingModalOpen.value = true
        missingModalinvoices.value = uncorrectedParsedInvoices
        return
    }

    missingModalOpen.value = false
    console.log(200)
    updatingNomenclatureIn1C()
}

const updatingNomenclatureIn1C = () => {
    console.log("132")
    allParsedInvoices.value.forEach(invoice => {
        
          console.log(invoice.data)
        
    });
}


const orderData = useOrderData()

// КНОПКИ

const CHECK_ICON = `<div class="bg-green-100 text-green-700 flex h-full w-full items-center justify-center"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div>`
const CROSS_ICON = '<div class="bg-red-100 text-red-700 flex h-full w-full items-center justify-center"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></div>'

const available = ref<Record<string, boolean>>({})

// ИНПУТ

const fileUpload = ref()

// СУБМИТ

const infoModal = ref()


</script>