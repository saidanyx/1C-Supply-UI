<template>
    <section v-if="isOpen" class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full bg-black/50 z-10 flex justify-center items-center" @click.self="close">
        <div class="modalContent w-2xl bg-white h-fit py-6 px-6 box-border relative flex flex-col items-start rounded-xl">
            <div>
                <h2 class="pr-6 text-lg font-bold text-balance">Вы точно уверены?</h2>
                <p class="mt-1 text-sm leading-relaxed text-gray-500">Это действие нельзя будет отменить.</p>
            </div>
            <div class="mt-6 w-full flex justify-end gap-3">
                <button type="button" class="rounded-xl closeModalBtn bg-gray-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300" @click="close">Отмена</button>
                <button type="button" class="rounded-xl setupBtn bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300" @click="confirm">Подтвердить</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const emit = defineEmits<{
    confirm: []
}>()

const open = () => {
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

const confirm = () => {
    emit('confirm')
    close()
}

defineExpose({
    open,
    close
})

watch(isOpen, (value) => {
    document.body.classList.toggle('overflow-hidden', value)
})
</script>