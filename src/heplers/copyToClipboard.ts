import toast from "react-hot-toast";

export const copyToClipboard = (text: string) => {
	// Создаём временный textarea
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.style.position = "fixed"; // Чтобы не было прокрутки страницы
	document.body.appendChild(textarea);

	// Выделяем и копируем
	textarea.select();
	try {
		const success = document.execCommand("copy");
		if (success) {
			toast.success(`ID ${text} скопирован!`);
		} else {
			toast.error("Не удалось скопировать ID");
		}
	} catch (err) {
		toast.error("Браузер не поддерживает копирование");
		console.error("Copy failed:", err);
	} finally {
		// Удаляем textarea
		document.body.removeChild(textarea);
	}
};
