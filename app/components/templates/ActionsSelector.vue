<template>
    <header class="flex flex-col gap-2 text-center">
        <span class="text-sm font-medium uppercase tracking-wide text-gray-400">Заказ №1043 от 04.08.2026</span>
        <h1 class="text-balance text-2xl font-semibold text-gray-900">Ответ по заказу</h1>
        <p class="text-pretty text-sm leading-relaxed text-gray-500">Выберите, как вы можете выполнить эту поставку. От выбранного варианта зависит следующий шаг.</p>
    </header>

    <div class="flex flex-col gap-3">
        <button @click="emit('select-action', 'accept')" type="button" data-action="accept" class="fork-button decision group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-transform group-hover:scale-105">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            </span>
            <span class="flex min-w-0 flex-col gap-0.5">
                <span class="text-base font-semibold text-gray-900">Подтвердить поставку</span>
                <span class="text-pretty text-sm leading-relaxed text-gray-500">В наличии есть все позиции</span>
            </span>
            <svg class="ml-auto h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <button @click="emit('select-action', 'partial')" type="button" data-action="partial" class="fork-button decision group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50/60 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-transform group-hover:scale-105">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10"/><path d="M4 12h7"/><path d="M4 18h10"/><path d="m16 15 2.5 2.5L22 13"/></svg>
            </span>
            <span class="flex min-w-0 flex-col gap-0.5">
                <span class="text-base font-semibold text-gray-900">Частично подтвердить</span>
                <span class="text-pretty text-sm leading-relaxed text-gray-500">Одной или более позиций нет в наличии</span>
            </span>
            <svg class="ml-auto h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <button @click="emit('select-action', 'reject')" type="button" data-action="reject" class="fork-button decision group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-red-300 hover:bg-red-50/60 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 transition-transform group-hover:scale-105">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </span>
            <span class="flex min-w-0 flex-col gap-0.5">
                <span class="text-base font-semibold text-gray-900">Полностью отклонить</span>
                <span class="text-pretty text-sm leading-relaxed text-gray-500">Ни одной позиции нет в наличии или иная причина</span>
            </span>
            <svg class="ml-auto h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['select-action'])
</script>