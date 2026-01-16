// Əgər terminalda xəta versə, 'import' yerinə 'const Bytez = require("bytez.js").default' yoxlaya bilərsən
import Bytez from "bytez.js"

const key = "cc2ac0caf3cab39bbd2ca9d519ebeeab";

const sdk = new Bytez(key)

async function testBytez() {
    console.log("🚀 Bytez API vasitəsilə GPT-4o yoxlanılır...");

    try {
        // Model olaraq gpt-4o seçirik
        const model = sdk.model("openai/gpt-5.2")

        console.log("⏳ Sorğu göndərilir, gözləyin...");
        
        const { error, output } = await model.run([
            {
                "role": "user",
                "content": "Salam! Sən GPT-4o-san? Azərbaycan dilində cavab ver."
            }
        ])

        if (error) {
            console.log("❌ XƏTA BAŞ VERDİ:");
            console.log(error);
        } else {
            console.log("✅ BAĞLANTI UĞURLUDUR!");
            console.log("🤖 Botun Cavabı:", output);
        }
    } catch (err) {
        console.error("🌐 Sistem xətası:", err.message);
    }
}

testBytez();