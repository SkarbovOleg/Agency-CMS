Agency CMS

CMS для управления сайтом агентства. Позволяет управлять карточками сотрудников, цветовой темой и внешними ссылками.

🚀 Быстрый старт (за 3 минуты)

Требования
Docker Desktop (скачать с [docker.com](https://www.docker.com/products/docker-desktop/))

Запуск

1. Склонировать репозиторий
git clone https://github.com/ВАШ_ЛОГИН/agency-cms
cd agency-cms

2. Запустить одной командой
docker-compose up --build


### После запуска

| Страница | Адрес |
|----------|-------|
| Портал | http://localhost:8000 |
| Админ-панель | http://localhost:8000/admin.html |
| Демо-сайт | http://localhost:8000/demo.html |

Остановка

docker-compose down

📋 Функционал

| Функция | Описание |
|---------|----------|
| **Команда** | Добавление/удаление сотрудников (ФИО, должность, описание, аватар) |
| **Цветовая тема** | Изменение основных цветов сайта |
| **Внешние ссылки** | Добавление ссылок (обычные или кнопки) |

🔌 Интеграция в ваш сайт

1. Подключите скрипт

<script src="http://localhost:8000/embed.js"></script>


2. Добавьте контейнеры

<!-- Для команды -->
<div id="team-container"></div>

<!-- Для ссылок -->
<div id="links-container"></div>

3. Инициализируйте

<script>
    AgencyCMS.loadTeam('#team-container');
    AgencyCMS.applyTheme();
    AgencyCMS.loadLinks('#links-container');
</script>

📡 REST API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/team` | Все сотрудники |
| POST | `/api/team` | Добавить сотрудника |
| DELETE | `/api/team/:id` | Удалить сотрудника |
| GET | `/api/theme` | Цветовая тема |
| PUT | `/api/theme` | Обновить тему |
| GET | `/api/links` | Все ссылки |
| POST | `/api/links` | Добавить ссылку |
| DELETE | `/api/links/:id` | Удалить ссылку |

Пример запроса (добавление сотрудника)

curl -X POST http://localhost:8000/api/team \
  -F "full_name=Иван Иванов" \
  -F "position=Дизайнер" \
  -F "bio=Опыт 5 лет" \
  -F "avatar=@photo.jpg"

🛠 Установка без Docker

Если Docker не установлен:

npm install
node server.js

📁 Структура проекта

agency-cms/
├── docker-compose.yml   # Запуск одной командой
├── Dockerfile
├── server.js            # Express + REST API
├── package.json
├── db.json              # База данных (создаётся автоматически)
├── uploads/             # Аватары сотрудников
├── public/
│   ├── index.html       # Портал
│   ├── admin.html       # Админ-панель
│   ├── demo.html        # Демо-сайт
│   └── embed.js         # Скрипт для интеграции
└── README.md

⚠️ Возможные проблемы

| Проблема | Решение |
|----------|---------|
| `docker: command not found` | Установите Docker Desktop |
| Порт 8000 занят | Остановите программу, использующую порт |
| Ошибка при сборке | Запустите `docker-compose down` и повторите |

✅ Проверка работоспособности

1. Откройте http://localhost:8000/admin.html
2. Добавьте сотрудника
3. Откройте http://localhost:8000/demo.html
4. Убедитесь, что карточка появилась

© 2026 Agency CMS
---

**Всё! Скопируй это в `README.md` и залей на GitHub.** 🚀
