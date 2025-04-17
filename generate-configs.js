require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Функция для замены плейсхолдеров в шаблоне
function replacePlaceholders(templatePath, outputPath) {
	const template = fs.readFileSync(templatePath, "utf8");
	const replaced = template.replace(/\$\{(\w+)\}/g, (_, key) => {
		if (!process.env[key]) {
			throw new Error(`Переменная окружения ${key} не определена`);
		}
		return process.env[key];
	});
	fs.writeFileSync(outputPath, replaced);
}

// Генерация package.json
replacePlaceholders(
	path.join(__dirname, "templates/package.json.template"),
	path.join(__dirname, "package.json")
);

console.log("Конфигурации успешно сгенерированы!");
