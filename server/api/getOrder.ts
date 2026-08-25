const pathToBase = "http://localhost://sb/hs"
const auth = Buffer.from(`saidanyx:`).toString("base64")


export default defineEventHandler(async (event) => {
    const method = event.method 
    const query = getQuery(event) 
    try {
       const response = await fetch(`${pathToBase}/procurement/getOrder?uuid=${query.uuid}`, {
            headers: {
                "Authorization": `Basic ${auth}`,
            },
       })

       if (!response.ok) {
            console.error(await response.text())
            throw createError({
                statusCode: response.status || 500,
                statusMessage: response.statusText || 'Internal Server Error',
                message: `An unexpected error occurred: ${response.text}`,
            });
       }
       return await response.json()

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal Server Error',
            message: `An unexpected error occurred: ${error.message}`,
        });
    }
}) 