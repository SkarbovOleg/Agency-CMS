// Скрипт для внедрения CMS на любой сайт
(function() {
    // Определяем базовый URL API
    const API_BASE = '/api';
    
    window.AgencyCMS = {
        // Загрузка команды
        async loadTeam(containerSelector) {
            try {
                const response = await fetch(`${API_BASE}/team`);
                const team = await response.json();
                const container = document.querySelector(containerSelector);
                
                if (!container) {
                    console.error(`Контейнер ${containerSelector} не найден`);
                    return;
                }
                
                if (team.length === 0) {
                    container.innerHTML = '<p style="text-align:center; color:#999;">Нет сотрудников в команде</p>';
                    return;
                }
                
                container.innerHTML = team.map(member => `
                    <div class="cms-team-card">
                        ${member.avatar_url ? `<img src="${member.avatar_url}" alt="${this.escapeHtml(member.full_name)}">` : '<div style="width:150px; height:150px; background:#ddd; border-radius:50%; margin:0 auto 15px; display:flex; align-items:center; justify-content:center;">📷</div>'}
                        <h3>${this.escapeHtml(member.full_name)}</h3>
                        <div class="position">${this.escapeHtml(member.position)}</div>
                        <p>${this.escapeHtml(member.bio || '')}</p>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Ошибка загрузки команды:', error);
            }
        },
        
        // Применение цветовой темы
        async applyTheme() {
            try {
                const response = await fetch(`${API_BASE}/theme`);
                const theme = await response.json();
                
                // Применяем цвета к body
                if (theme.background_color) {
                    document.body.style.backgroundColor = theme.background_color;
                }
                if (theme.text_color) {
                    document.body.style.color = theme.text_color;
                }
                
                // Добавляем CSS переменные
                const style = document.createElement('style');
                style.textContent = `
                    :root {
                        --cms-primary: ${theme.primary_color || '#3498db'};
                        --cms-secondary: ${theme.secondary_color || '#2c3e50'};
                    }
                    a, .cms-link {
                        color: var(--cms-primary) !important;
                    }
                    .cms-link:hover {
                        opacity: 0.8;
                    }
                    button, .cms-button {
                        background-color: var(--cms-secondary) !important;
                        color: white !important;
                        border: none !important;
                    }
                    .cms-button:hover {
                        opacity: 0.9;
                        cursor: pointer;
                    }
                `;
                
                // Удаляем старый стиль если есть
                const oldStyle = document.getElementById('cms-theme-style');
                if (oldStyle) oldStyle.remove();
                
                style.id = 'cms-theme-style';
                document.head.appendChild(style);
            } catch (error) {
                console.error('Ошибка загрузки темы:', error);
            }
        },
        
        // Загрузка внешних ссылок
        async loadLinks(containerSelector) {
            try {
                const response = await fetch(`${API_BASE}/links`);
                const links = await response.json();
                const container = document.querySelector(containerSelector);
                
                if (!container) {
                    console.error(`Контейнер ${containerSelector} не найден`);
                    return;
                }
                
                if (links.length === 0) {
                    container.innerHTML = '<p>Нет ссылок</p>';
                    return;
                }
                
                container.innerHTML = links.map(link => {
                    if (link.type === 'button') {
                        return `<button class="cms-button" onclick="window.open('${this.escapeHtml(link.url)}', '_blank')">${this.escapeHtml(link.name)}</button>`;
                    } else {
                        return `<a href="${this.escapeHtml(link.url)}" class="cms-link" target="_blank" rel="noopener noreferrer">${this.escapeHtml(link.name)}</a>`;
                    }
                }).join('');
            } catch (error) {
                console.error('Ошибка загрузки ссылок:', error);
            }
        },
        
        // Вспомогательная функция для экранирования HTML
        escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }
    };
})();