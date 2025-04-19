# Содержание

-   [Обзор](#обзор)
-   [Особенности](#особенности)
-   [Деплой](#деплой)

# Обзор

Приложение представляет из себя веб-интерфейс для визуализации выполненных задач на активных ветках.
Постарался сделать более-менее внятный интерфейс, подсказки для удобства.
Приложение сделано на стеке:

-   React
-   TypeScript
-   Axios
-   Reactflow

# Особенности

-   **Генерация по мере продвижения по дереву.**
    Сделал через послойное добавление узлов дерева чанками(чанк - некое кол-во слоев). Размер чанка определяется исходя из высоты экрана.
    Рендерятся корни и первый чанк, а остальные чанки по мере перемещения вниз.
    При этом для освобождения ресурсов рендерятся только те узлы, которые видно на экране.
-   **Шаблоны package.json и nginx.conf.**
    Из-за того, что почему-то ендпоинт присылал ошибку CORS, я добавил проксирование запроса. Подумал, что домен относится к чувствительной информации и вынес его в шаблон, по которому скриптом `generate-configs.js` генерируются файлы для последующего деплоя.
-   **CI/CD**
    Арендовал виртуальный сервер, прописал конфигурацию github actions, по которой на арендованном сервере собирается Docker-образ и запускается, собственно. Всю чувствительную информацию засунул в секреты гитхаба.

# Деплой

[ССЫЛКА НА РАЗВЕРНУТОЕ ПРИЛОЖЕНИЕ](http://77.222.46.6/)
