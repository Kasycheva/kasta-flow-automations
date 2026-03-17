# Проект: Kasta Flow Studio — сайт

## Репозиторий
- Локальная папка: C:\Users\Kasyc\OneDrive\Desktop\kasta-flow-automations
- GitHub: https://github.com/Kasycheva/kasta-flow-automations
- Деплой: Vercel (планируется)
- Основная ветка: main

## Происхождение
- Создан в Lovable.dev
- Стек: React + TypeScript + Tailwind CSS + Vite
- UI компоненты: shadcn/ui

## Язык
- Основной: английский
- Второй язык: норвежский (в разработке, i18n не завершён)

## Что НЕЛЬЗЯ трогать
- .env и .env.local файлы
- package-lock.json
- Файлы в public/images/brand/

## Правила изменений
- Перед любыми правками — показывай план
- Мелкие правки — напрямую в main
- Крупные изменения — feature ветка
- Перед пушем — npm run build должен проходить
- Коммиты на английском: Fix navigation, Add contact form

## Текущие задачи (очередь)
- [ ] Вычистить мусор от старой темы (иконки, фавиконки UAV)
- [ ] Исправить адаптив (мобильная версия)
- [ ] Переделать FAQ секцию
- [ ] Доработать калькулятор экономии (JavaScript)
- [ ] Разделить формы: заказ услуг / специфический запрос
- [ ] Добавить голосовой ввод → транскрипция → Google Sheets
- [ ] Встроенный AI-агент (отвечает на вопросы + приглашает к заказу)
- [ ] Доделать норвежский перевод
- [ ] Обновить контент и формулировки

## После деплоя (отдельный этап)
- Домен (рассматриваем .no и .com/.studio)
- Google Analytics 4
- Google Search Console
- sitemap.xml, robots.txt, Open Graph, hreflang