document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ОБ'ЄКТИ МОДАЛЬНИХ ВІКОН ---
    const modals = {
        order: document.getElementById("orderModal"),
        info: document.getElementById("infoModal"),
        thanks: document.getElementById("thanksModal"),
        schedule: document.getElementById("scheduleModal"),
        gallery: document.getElementById("gallery-modal")
    };

    const orderBtns = document.querySelectorAll(".open-modal");
    const infoBtn = document.getElementById("infoBtn");
    const closeBtns = document.querySelectorAll(".close-modal, .close-thanks, .gallery-close");

    // --- 2. УНІВЕРСАЛЬНЕ КЕРУВАННЯ МОДАЛКАМИ ---

    // Функція для закриття всіх активних модалок
    const closeAllModals = () => {
        Object.values(modals).forEach(modal => {
            if (modal) modal.style.display = "none";
        });
        document.body.style.overflow = "auto";
    };

    // Відкриття модалки замовлення
    orderBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            closeAllModals();
            if (modals.order) modals.order.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    });

    // Відкриття модалки інформації (карта цін)
    if (infoBtn) {
        infoBtn.onclick = (e) => {
            e.preventDefault();
            closeAllModals();
            if (modals.info) modals.info.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    }

    // Обробка всіх кнопок закриття (хрестики та кнопки "Зрозуміло")
    closeBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            closeAllModals();
        };
    });

    // Закриття при кліку на темний фон
    window.addEventListener('click', (e) => {
        if (Object.values(modals).includes(e.target)) {
            closeAllModals();
        }
    });

    // Глобальні функції для виклику з HTML (onclick)
    window.openScheduleModal = () => {
        closeAllModals();
        if (modals.schedule) modals.schedule.style.display = "block";
        document.body.style.overflow = "hidden";
    };
    
    window.closeScheduleModal = closeAllModals;

    // --- 3. ВІДЖЕТ ГРАФІКА РОБОТИ (ТЕКСТ ЩО ЗМІНЮЄТЬСЯ) ---
    const scheduleText = document.getElementById('scheduleText');
    if (scheduleText) {
        const messages = ["Графік роботи"];
        let msgIndex = 0;

        setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            // Зміна тексту відбувається під час того, як контейнер закритий анімацією (через 5 сек)
            setTimeout(() => {
                scheduleText.textContent = messages[msgIndex];
            }, 5000);
        }, 10000);
    }

    // --- 4. АНІМАЦІЯ ПОЯВИ ПРИ СКРОЛІ (REVEAL) ---
    const reveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 50;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Запуск при завантаженні сторінки

    // --- 5. ОБРОБКА ФОРМИ ЗАМОВЛЕННЯ ---
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.onsubmit = (e) => {
            e.preventDefault();
            
            const data = {
                phone: document.getElementById('userPhone').value,
                surname: document.getElementById('userSurname').value,
                type: document.getElementById('type').value === 'digital' ? "Цифрове фото" : "Друк (Самовивіз)",
                format: document.getElementById('format').value,
                quantity: document.getElementById('quantity').value,
                comment: document.getElementById('comment').value,
                filesCount: document.getElementById('photo')?.files.length || 0
            };

            const bodyText = `НОВЕ ЗАМОВЛЕННЯ\n` +
                `---------------------------\n` +
                `👤 Прізвище: ${data.surname}\n` +
                `📞 Телефон: ${data.phone}\n` +
                `🛠 Послуга: ${data.type}\n` +
                `📐 Формат: ${data.format}\n` +
                `🔢 Кількість: ${data.quantity}\n` +
                `💬 Коментар: ${data.comment}\n` +
                `---------------------------\n` +
                `📂 Фото у формі: ${data.filesCount} шт.\n\n` +
                `⚠️ ВАЖЛИВО: Натисніть на "СКРІПКУ" та додайте фото до листа!`;

            const isWindows = navigator.platform.toLowerCase().includes('win');
            const targetEmail = "fotokomfort@gmail.com";
            const subject = encodeURIComponent(`Замовлення: ${data.surname} | ${data.phone}`);
            const body = encodeURIComponent(bodyText);

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            // Відкриваємо пошту
            isWindows ? window.open(gmailUrl, '_blank') : window.location.href = mailtoUrl;

            // Показуємо вікно подяки
            closeAllModals();
            if (modals.thanks) {
                document.getElementById('thanksTitle').innerText = `Дякуємо, ${data.surname}!`;
                document.getElementById('thanksMessage').innerHTML = isWindows 
                    ? "Ми відкрили <b>Gmail</b>. Будь ласка, додайте фото через скріпку та надішліть лист." 
                    : "Зараз відкриється ваша <b>пошта</b>. Не забудьте додати фото перед відправкою!";
                modals.thanks.style.display = "block";
                document.body.style.overflow = "hidden";
            }
        };
    }

    // --- 6. ГАЛЕРЕЯ ТОВАРІВ (ЯКЩО Є) ---
    const modalImg = document.getElementById('gallery-img');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentImages = [];
    let currentIndex = 0;

    document.querySelectorAll('.product-img img').forEach(img => {
        img.addEventListener('click', function() {
            const imagesAttr = this.getAttribute('data-images');
            currentImages = imagesAttr ? imagesAttr.split(',') : [this.src];
            currentIndex = 0;
            
            if (modalImg) {
                modalImg.src = currentImages[currentIndex];
                modals.gallery.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Керування стрілками
                if (prevBtn && nextBtn) {
                    const showBtns = currentImages.length > 1 ? 'block' : 'none';
                    prevBtn.style.display = showBtns;
                    nextBtn.style.display = showBtns;
                }
            }
        });
    });

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        };
    }

    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        };
    }
});

// --- 7. ГЛОБАЛЬНІ ДОПОМІЖНІ ФУНКЦІЇ ---

// Копіювання номера картки
function copyCard(number, bankName) {
    navigator.clipboard.writeText(number).then(() => {
        const thanksModal = document.getElementById("thanksModal");
        if (thanksModal) {
            document.getElementById("thanksTitle").innerText = "Скопійовано!";
            document.getElementById("thanksMessage").innerHTML = `Номер картки <b>${bankName}</b> скопійовано. Вставте його у банківський додаток.`;
            thanksModal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    });
}

// Пряме відправлення листа розробнику або студії
function sendMailDirect(email, subjectText = "Питання щодо Komfort") {
    const isWindows = navigator.platform.toLowerCase().includes('win');
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent("Вітаю! У мене є питання щодо...");
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    isWindows ? window.open(gmailUrl, '_blank') : window.location.href = mailtoUrl;
}