export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const init = await import("@/utils/init");
        await init.init();
    }
}
