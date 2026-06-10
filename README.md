 📖 Agency CMS  Полная инструкция (без папки backend)

 О проекте

Agency CMS  система управления контентом для сайта агентства. Позволяет управлять карточками сотрудников, цветовой темой и внешними ссылками через удобную админпанель и REST API.

Вся структура проекта находится в корневой папке, без вложенной папки `backend`.



 📁 Структура проекта (актуальная)

agencycms/
 server.js               Express сервер + REST API
 database.js             SQLite база данных
 package.json            Зависимости
 Dockerfile              Docker образ
 dockercompose.yml      Docker Compose
 uploads/                Аватары сотрудников
 database.sqlite         База данных (создаётся автоматически)
 public/
│    index.html          Портал
│    admin.html          Админпанель
│    demo.html           Демосайт
│   └ embed.js            Скрипт для интеграции
└ README.md               Документация



 🚀 Быстрый старт (за 3 минуты)

 Требования
 Docker Desktop (скачать с [docker.com](https://www.docker.com/products/dockerdesktop/))

 Запуск одной командой

 1. Склонировать репозиторий
git clone https://github.com/SkarbovOleg/Agency-CMS.git
cd agencycms

 2. Запустить проект
dockercompose up build

 После запуска

| Страница | Адрес |
|||
| Портал | http://localhost:8000 |
| Админпанель | http://localhost:8000/admin.html |
| Демосайт | http://localhost:8000/demo.html |

 Остановка проекта

dockercompose down




 📋 Функционал

| Функция | Описание |
|||
| **Команда** | Добавление/редактирование/удаление сотрудников (ФИО, должность, описание, аватар) |
| **Цветовая тема** | Изменение основных цветов сайта в реальном времени |
| **Внешние ссылки** | Добавление ссылок (обычные или кнопки) для соцсетей |



 🔌 Интеграция на ваш сайт

 Способ 1: Быстрая интеграция (рекомендуется)

 Шаг 1. Подключите скрипт

Добавьте в `<head>` вашего сайта:

<script src="http://localhost:8000/embed.js"></script>


 Шаг 2. Добавьте контейнеры

В места, где должны отображаться данные:

<! Для команды >
<div id="teamcontainer"></div>

<! Для ссылок >
<div id="linkscontainer"></div>


 Шаг 3. Инициализируйте CMS

Добавьте перед закрывающим тегом `</body>`:

<script>
    // Загрузка команды
    AgencyCMS.loadTeam('teamcontainer');
    
    // Применение цветовой темы
    AgencyCMS.applyTheme();
    
    // Загрузка ссылок
    AgencyCMS.loadLinks('linkscontainer');
</script>
```

 Шаг 4. Добавьте стили (опционально)

.teamgrid {
    display: grid;
    gridtemplatecolumns: repeat(autofill, minmax(300px, 1fr));
    gap: 20px;
}

.cmsteamcard {
    background: white;
    borderradius: 12px;
    padding: 20px;
    textalign: center;
    boxshadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cmsteamcard img {
    width: 150px;
    height: 150px;
    borderradius: 50%;
    objectfit: cover;
}

.cmslink, .cmsbutton {
    display: inlineblock;
    margin: 0 10px;
    padding: 10px 20px;
    borderradius: 8px;
    textdecoration: none;
}

.cmsbutton {
    border: none;
    cursor: pointer;
}


 Способ 2: Интеграция с React

import { useEffect } from 'react';

function App() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'http://localhost:8000/embed.js';
        script.onload = () => {
            window.AgencyCMS.loadTeam('teamcontainer');
            window.AgencyCMS.applyTheme();
            window.AgencyCMS.loadLinks('linkscontainer');
        };
        document.head.appendChild(script);
    }, []);

    return (
        <div>
            <div id="teamcontainer"></div>
            <div id="linkscontainer"></div>
        </div>
    );
}


 Способ 3: Только API (для разработчиков)

// Получить всех сотрудников
fetch('/api/team')
    .then(res => res.json())
    .then(team => console.log(team));

// Получить цветовую тему
fetch('/api/theme')
    .then(res => res.json())
    .then(theme => console.log(theme));

// Получить ссылки
fetch('/api/links')
    .then(res => res.json())
    .then(links => console.log(links));



 📡 REST API

 Эндпоинты

| Метод | Эндпоинт | Описание |
||||
| GET | `/api/team` | Получить всех сотрудников |
| POST | `/api/team` | Добавить сотрудника |
| DELETE | `/api/team/:id` | Удалить сотрудника |
| GET | `/api/theme` | Получить цветовую тему |
| PUT | `/api/theme` | Обновить цветовую тему |
| GET | `/api/links` | Получить все ссылки |
| POST | `/api/links` | Добавить ссылку |
| DELETE | `/api/links/:id` | Удалить ссылку |

 Примеры запросов

Добавление сотрудника:

curl X POST http://localhost:8000/api/team \
  H "ContentType: application/json" \
  d '{"full_name":"Иван Иванов","position":"Дизайнер","bio":"Опыт 5 лет"}'


Обновление темы:

curl X PUT http://localhost:8000/api/theme \
  H "ContentType: application/json" \
  d '{"primary_color":"ff0000","secondary_color":"00ff00","background_color":"ffffff"}'


Добавление ссылки:

curl X POST http://localhost:8000/api/links \
  H "ContentType: application/json" \
  d '{"name":"Telegram","url":"https://t.me/username","type":"button"}'


Пример ответа API

GET /api/team:

[
    {
        "id": "123e4567e89b12d3a456426614174000",
        "full_name": "Иван Иванов",
        "position": "Дизайнер",
        "bio": "Опыт работы 5 лет",
        "avatar_url": "/uploads/photo.jpg",
        "created_at": "20240608 12:00:00"
    }
]


🛠 Установка без Docker

Если Docker не установлен:

 1. Установить зависимости
npm install

 2. Запустить сервер
node server.js


После запуска откройте http://localhost:8000


🗄️ База данных (SQLite)

Схема БД

Таблица `team`:
 `id` (TEXT, PRIMARY KEY)  уникальный идентификатор
 `full_name` (TEXT, NOT NULL)  ФИО сотрудника
 `position` (TEXT, NOT NULL)  должность
 `bio` (TEXT)  описание
 `avatar_url` (TEXT)  ссылка на аватар
 `created_at` (DATETIME)  дата создания

Таблица `theme`:
 `id` (INTEGER, PRIMARY KEY)  всегда 1
 `primary_color` (TEXT)  основной цвет
 `secondary_color` (TEXT)  вторичный цвет
 `background_color` (TEXT)  цвет фона
 `updated_at` (DATETIME)  дата обновления

Таблица `links`:
 `id` (TEXT, PRIMARY KEY)  уникальный идентификатор
 `name` (TEXT, NOT NULL)  название ссылки
 `url` (TEXT, NOT NULL)  URL
 `type` (TEXT)  тип: 'href' или 'button'


📄 Файлы для GitHub (все в корне)

`Dockerfile`

FROM node:18alpine
WORKDIR /app
RUN apk add nocache sqlite
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir p uploads
EXPOSE 8000
CMD ["npm", "start"]

`dockercompose.yml`

services:
  cms:
    build: .
    ports:
       "8000:8000"
    volumes:
       ./uploads:/app/uploads
       ./database.sqlite:/app/database.sqlite
       ./public:/app/public
    restart: unlessstopped

`package.json`

{
  "name": "agencycms",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5lts.1",
    "uuid": "^9.0.0",
    "sqlite3": "^5.1.7"
  }
}

🧑‍💻 Админпанель

Возможности

| Раздел | Что можно делать |
|||
| **Команда** | Добавлять сотрудников (ФИО, должность, описание, URL аватара), удалять |
| **Цветовая тема** | Выбирать основной, вторичный цвет и цвет фона |
| **Внешние ссылки** | Добавлять ссылки (обычные или кнопки), удалять |


🎨 Демосайт

Пример внедрения CMS на сайт. Показывает:

 Карточки всех добавленных сотрудников
 Применённую цветовую тему
 Добавленные ссылки и кнопки


⚠️ Возможные проблемы и решения

| Проблема | Решение |
|||
| `docker: command not found` | Установите Docker Desktop |
| Порт 8000 занят | Остановите программу, использующую порт, или измените порт в `dockercompose.yml` |
| Ошибка при сборке Docker | Запустите `dockercompose down`, затем `dockercompose up build` |
| Аватары не отображаются | Проверьте что URL аватара доступен из интернета |
| Данные не сохраняются | Проверьте права на запись в папке проекта |
| `Cannot GET /` | Убедитесь что папка `public` существует и содержит `index.html` |
| `SQLITE_ERROR: no such table` | Удалите `database.sqlite` и перезапустите  таблицы создадутся заново |


❓ Часто задаваемые вопросы

1. Как интегрировать с React/Vue/Angular?

CMS не зависит от фреймворка. Просто добавьте `<div id="teamcontainer"></div>` в любой компонент и подключите `embed.js`.

2. Как быть с большой файловой структурой?

CMS ищет только свои контейнеры (`teamcontainer`, `linkscontainer`). Ей не важно, React у вас, Vue или обычный HTML.

3. Что делать с цветами через SCSS/CSS?

CMS не трогает ваши стили. Она добавляет свои CSSпеременные и применяет их только к своим элементам (`.cmsteamcard`, `.cmsbutton`).

4. Это работает на реальном сайте?

Да. Демосайт  просто пример. CMS  полноценный сервер на Node.js с REST API и базой данных SQLite. Можно развернуть на любом хостинге (Render, VPS, свой сервер).

5. Где хранятся данные?

Данные хранятся в SQLite базе данных (`database.sqlite`). Аватары  в папке `uploads/`.

6. Как сделать резервную копию?

Скопируйте файлы `database.sqlite` и папку `uploads/`.


📝 Чеклист для сдачи проекта

 [ ] Репозиторий на GitHub
 [ ] `Dockerfile` в корне
 [ ] `dockercompose.yml` в корне
 [ ] `dockercompose up build` работает
 [ ] Админпанель открывается
 [ ] Можно добавить сотрудника
 [ ] Можно изменить цветовую тему
 [ ] Можно добавить ссылку
 [ ] Демосайт отображает все изменения
 [ ] REST API возвращает JSON
 [ ] `README.md` заполнен


📄 Лицензия

MIT


👤 Контакты

По вопросам интеграции: agencycmsofficial@gmail.com

© 2026 Agency CMS
