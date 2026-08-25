<template>
    <header class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-balance">Заказ поставщику</h1>
        <p class="text-sm text-gray-500">Подтвердите, что полностью отклоняете заказ</p>
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
            <tbody id="items-body" class="divide-y divide-gray-100"></tbody>
        </table>
    </section>

    <section class="flex flex-col gap-2">
        <label for="comment" class="text-sm font-medium">Комментарий</label>
        <textarea id="comment" rows="4" placeholder="Укажите причину отклонения заказа" class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"></textarea>
    </section>

    <button type="button" id="confirm-btn" class="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700">Подтвердить заказ</button>

    <SharedConfirmModal ref="infoModal" @confirm="handleConfirm" />
</template>

<script setup lang="ts">
const infoModal = ref()

const openModal = () => {
    infoModal.value?.open()
}

const handleConfirm = () => {
    // действие после подтверждения
}
</script>