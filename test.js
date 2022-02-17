const clientId = "50fefce66c614d6191bf6c897b737cc3";
const secret = "3f26e82805c741a48ab420059fd5dfc9";

const header = Buffer.from(`${clientId}:${secret}`).toString("base64");

console.log(header);
