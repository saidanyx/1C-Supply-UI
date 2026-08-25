<template>
    <main class="justify-center-safe min-h-[100vh] font-sans text-gray-900 antialiased mx-auto flex max-w-3xl flex-col gap-6">
        <TemplatesActionsSelector v-if="!action" @select-action="handleDeliveryAction"/>
        <TemplatesAcceptAction v-if="action == 'accept'" />
        <TemplatesPartialAction v-if="action == 'partial'" />
        <TemplatesRejectAction v-if="action == 'reject'" />
    </main>
</template>

<script setup lang="ts">
const orderData = useOrderData()

const route = useRoute()

let paramUUID = computed(() => route.query.uuid || "")

console.log("uuid:", paramUUID.value)

let action = ref<string>("")

const { data: items, execute, error } = await useFetch("/api/getOrder", {
  query: route.query,
  immediate: paramUUID.value.length > 0
})

onMounted(async () => {
    if (paramUUID.value.length == 0) {
        showError({ statusCode: 404, statusMessage: 'Страница не найдена' })
    }

    if (!items.value) {
        await execute()
    }

    if (error.value) {
        console.error("Ошибка загрузки данных:", error.value);
        showError({
            statusCode: error.value.statusCode || 500,
            statusMessage: error.value.statusMessage || 'Ошибка загрузки данных'
        });
        return;
    }

    console.log("Данные успешно загружены:", items.value)
    orderData.value!.Table = items.value.Table
    orderData.value!.UUID = items.value.UUID
    console.log(orderData.value?.Table)
})

const handleDeliveryAction = (selectedAction: string) => {
    console.log('Выбранное действие:', selectedAction);
    action.value = selectedAction
    orderData.value!.Action = selectedAction
};
</script>
