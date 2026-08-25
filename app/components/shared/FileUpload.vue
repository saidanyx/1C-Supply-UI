<template>
    <section class="flex flex-col gap-2">
        <span class="text-sm font-medium">Счет</span>

        <label class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50">
            <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
            <span class="text-sm text-gray-600">Нажмите, чтобы прикрепить счет</span>
            <span class="text-xs text-gray-400">PDF, EXCEL</span>
            <input type="file" multiple accept=".pdf,.xls,.xlsx" class="hidden" @change="handleFiles" />
        </label>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <ul v-if="files.length" class="flex flex-col gap-2">
            <li v-for="(file, index) in files" :key="`${file.name}-${file.size}-${file.lastModified}`" class="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
                <span class="flex min-w-0 items-center gap-2">
                    <svg class="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                    <span class="truncate">{{ file.name }}</span>
                    <span class="shrink-0 text-xs text-gray-400">{{ formatFileSize(file.size) }}</span>
                </span>

                <button type="button" class="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600" title="Удалить" aria-label="Удалить файл" @click="removeFile(index)">X</button>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
const files = ref<File[]>([])
const error = ref("")

const MAX_FILES = 3

const isDuplicate = (file: File, existingFiles: File[]) => {
    return existingFiles.some(existing =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified
    )
}

const handleFiles = (event: Event) => {
    const input = event.target as HTMLInputElement

    if (!input.files) return

    error.value = ""

    const selectedFiles = Array.from(input.files)
    const uniqueFiles: File[] = []

    for (const file of selectedFiles) {
        if (isDuplicate(file, files.value) || isDuplicate(file, uniqueFiles)) {
            error.value = `Файл "${file.name}" уже добавлен`
            continue
        }

        uniqueFiles.push(file)
    }

    if (files.value.length + uniqueFiles.length > MAX_FILES) {
        error.value = `Можно прикрепить не более ${MAX_FILES} счетов`
        return
    }

    files.value.push(...uniqueFiles)

    input.value = ""
}

const removeFile = (index: number) => {
    files.value.splice(index, 1)
    error.value = ""
}

const getFiles = () => {
    return files.value
}

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} Б`
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} КБ`
    }

    return `${(size / 1024 / 1024).toFixed(1)} МБ`
}

defineExpose({
    getFiles,
})
</script>