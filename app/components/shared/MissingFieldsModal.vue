<template>
    <section v-if="isOpen" class="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black/50" @click.self="close">
        <div class="relative flex h-fit w-full max-w-2xl flex-col items-start rounded-xl bg-white px-6 py-6 box-border">
            <div class="w-full">
                <h2 class="pr-6 text-lg font-bold text-balance">Не хватает реквизитов</h2>
                <p class="mt-1 text-sm leading-relaxed text-gray-500">Некоторые данные не удалось найти в счёте. Укажите их вручную.</p>
            </div>

            <div class="mt-6 flex w-full flex-col gap-4">
                <div v-for="invoice in uncorrectedInvoices"">
                    <!-- <h3>{{ invoice }}</h3> -->
                    <h3 v-if="invoice.id === 0 || invoice.id - 1 !== invoice.id">Счёт "{{ invoice.fileName}}":</h3>
                    <div v-for="key in invoice.emptyFields">
                        <div>
                            <label class="text-sm font-medium text-slate-700">{{ key }}</label>
                            <input v-model="invoice.data[key]" :class="submitted && !invoice.data[key] ? 'border-red-500 bg-red-50' : ''" type="text" class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex w-full justify-end gap-3">
                <button type="button" class="cursor-pointer rounded-xl bg-gray-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300" @click="close">Отмена</button>
                <button type="button" class="cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300" @click="confirm">Продолжить</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { InvoiceData, ParsedInvoice } from '../types/invoiceTypes';
const submitted = ref(false)

const props = defineProps<{
    isOpen: boolean
    uncorrectedInvoices: ParsedInvoice[]
}>()

const emit = defineEmits<{
    close: []
    confirm: [invoices: ParsedInvoice[]]
}>()

const close = () => {
    emit("close")
}

const confirm = () => {
    submitted.value = true

    const hasEmptyFields = props.uncorrectedInvoices.some(invoice => Object.values(invoice.data).some(value => !value))

    if (hasEmptyFields) {
        return
    }

    props.uncorrectedInvoices.forEach(invoice => {
        invoice.emptyFields = []
    });

    emit("confirm", props.uncorrectedInvoices)
}
</script>