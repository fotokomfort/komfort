document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("orderModal");
    const thanksModal = document.getElementById("thanksModal");
    const btns = document.querySelectorAll(".open-modal");
    const closeBtns = document.querySelectorAll(".close-modal, .close-thanks");

    // --- 1. КЕРУВАННЯ МОДАЛКАМИ (Відкриття та закриття) ---
    btns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    });

    closeBtns.forEach(btn => {
        btn.onclick = () => {
            modal.style.display = "none";
            thanksModal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    });

    // Закриття при кліку на темний фон
    window.onclick = (e) => { 
        if (e.target == modal || e.target == thanksModal) {
            modal.style.display = "none";
            thanksModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // --- 2. АНІМАЦІЯ ПРИ СКРОЛІ ---
    const reveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // --- 3. ВІДПРАВКА ФОРМИ ЗАМОВЛЕННЯ ---
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.onsubmit = (e) => {
            e.preventDefault();
            
            const phone = document.getElementById('userPhone').value;
            const surname = document.getElementById('userSurname').value;
            const type = document.getElementById('type').value;
            const format = document.getElementById('format').value;
            const quantity = document.getElementById('quantity').value;
            const comment = document.getElementById('comment').value;
            const fileInput = document.getElementById('photo');
            const filesCount = fileInput ? fileInput.files.length : 0;

            const typeText = (type === 'digital') ? "Цифрове фото" : "Друк (Самовивіз)";

            // Формування тексту листа
            const subjectText = `Замовлення: ${surname} | ${phone}`;
            const bodyText = `НОВЕ ЗАМОВЛЕННЯ\n` +
                `---------------------------\n` +
                `👤 Прізвище: ${surname}\n` +
                `📞 Телефон: ${phone}\n` +
                `🛠 Послуга: ${typeText}\n` +
                `📐 Формат: ${format}\n` +
                `🔢 Кількість: ${quantity}\n` +
                `💬 Коментар: ${comment}\n` +
                `---------------------------\n` +
                `📂 Фото у формі: ${filesCount} шт.\n\n` +
                `⚠️ ВАЖЛИВО: Будь ласка, натисніть на значок "СКРІПКА" та додайте ваші фото до листа!`;

            const subjectEncoded = encodeURIComponent(subjectText);
            const bodyEncoded = encodeURIComponent(bodyText);

            const platform = navigator.platform.toLowerCase();
            const isWindows = platform.indexOf('win') !== -1;

            // --- ЗАМІНЕНО НА fotokomfort@gmail.com ---
            const targetEmail = "fotokomfort@gmail.com";
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subjectEncoded}&body=${bodyEncoded}`;
            const mailtoUrl = `mailto:${targetEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;

            // Логіка переходу до пошти
            if (isWindows) {
                window.open(gmailUrl, '_blank');
            } else {
                window.location.href = mailtoUrl;
            }
            
            // Вікно подяки після відправки
            modal.style.display = "none";
            const thanksTitle = document.getElementById('thanksTitle');
            const thanksMessage = document.getElementById('thanksMessage');

            if (thanksTitle && thanksMessage) {
                thanksTitle.innerText = `Дякуємо, ${surname}!`;
                thanksMessage.innerHTML = isWindows 
                    ? "Ми відкрили <b>Gmail</b> у новій вкладці. Будь ласка, додайте фото через скріпку та надішліть цей лист нам." 
                    : "Зараз відкриється ваша <b>пошта</b>. Не забудьте натиснути на скріпку, щоб додати ваші фото!";
            }

            thanksModal.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    }
});

// --- 4. КОПІЮВАННЯ КАРТКИ ---
function copyCard(number, bankName) {
    navigator.clipboard.writeText(number).then(() => {
        const thanksModal = document.getElementById("thanksModal");
        const thanksTitle = document.getElementById("thanksTitle");
        const thanksMessage = document.getElementById("thanksMessage");

        if (thanksModal) {
            thanksTitle.innerText = "Скопійовано!";
            thanksMessage.innerHTML = `Номер картки <b>${bankName}</b> скопійовано. Тепер ви можете вставити його в додатку вашого банку для оплати.`;
            thanksModal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }).catch(err => {
        console.error('Не вдалося скопіювати:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const orderModal = document.getElementById("orderModal");
    const infoModal = document.getElementById("infoModal");
    const thanksModal = document.getElementById("thanksModal");

    const orderBtns = document.querySelectorAll(".open-modal"); // Кнопки "Замовити"
    const infoBtn = document.getElementById("infoBtn"); // Кнопка "Інформація"
    
    const closeBtns = document.querySelectorAll(".close-modal, .close-thanks");

    // Відкриття модалки ЗАМОВЛЕННЯ
    orderBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            orderModal.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    });

    // Відкриття модалки ІНФОРМАЦІЇ
    if (infoBtn) {
        infoBtn.onclick = (e) => {
            e.preventDefault();
            infoModal.style.display = "block";
            document.body.style.overflow = "hidden";
        };
    }

    // Закриття ВСІХ модалок
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            orderModal.style.display = "none";
            infoModal.style.display = "none";
            thanksModal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    });

    // Закриття при кліку на фон
    window.addEventListener('click', (e) => {
        if (e.target == orderModal || e.target == infoModal || e.target == thanksModal) {
            orderModal.style.display = "none";
            infoModal.style.display = "none";
            thanksModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // ... далі ваш код анімацій та відправки форми ...
});

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-img');
    const closeBtn = document.querySelector('.gallery-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentImages = [];
    let currentIndex = 0;

    // Відкриття при кліку на фото
    document.querySelectorAll('.product-img img').forEach(img => {
        img.addEventListener('click', function() {
            // Отримуємо список фото з атрибута data-images або просто беремо одне фото
            const imagesAttr = this.getAttribute('data-images');
            if (imagesAttr) {
                currentImages = imagesAttr.split(',');
            } else {
                currentImages = [this.src];
            }
            
            currentIndex = 0;
            updateModalImage();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Заборона скролу фону
        });
    });

    function updateModalImage() {
        modalImg.src = currentImages[currentIndex];
        // Сховати стрілки, якщо фото лише одне
        if (currentImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }

    // Перемикання вперед
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModalImage();
    });

    // Перемикання назад
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    });

    // Закриття
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Закриття при кліку поза фото
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalImg.parentElement) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});