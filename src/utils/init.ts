import {prisma} from "@/prisma";


export function init() {
    consoleAscii()
    console.log("====Init Functions====")
    createSettingsIfNotExist()
        .then(() => {
            console.log('====Initialization completed====');
        })
        .catch((err) => {
            console.error('Error during initialization:', err);
        });
}

async function createSettingsIfNotExist() {

    const settings = await prisma.settings.findUnique({
        where: {
            name: "system",
        }
    })
    if(!settings){
        console.log("====Init Setting====")
        await prisma.settings.create({
            data: {
                name: "system",
            }
        })
    }
}

function consoleAscii(){
    console.log("\n" +
        "    ____                __          __                          _____                               \n" +
        "   / __ \\ ____   _____ / /_ ____ _ / /_   ____ _ _____ ___     / ___/ ___   _____ _   __ ___   _____\n" +
        "  / /_/ // __ \\ / ___// __// __ `// __ \\ / __ `// ___// _ \\    \\__ \\ / _ \\ / ___/| | / // _ \\ / ___/\n" +
        " / ____// /_/ // /   / /_ / /_/ // /_/ // /_/ /(__  )/  __/   ___/ //  __// /    | |/ //  __// /    \n" +
        "/_/     \\____//_/    \\__/ \\__,_//_.___/ \\__,_//____/ \\___/   /____/ \\___//_/     |___/ \\___//_/     \n" +
        "                                                                                                    \n")
}