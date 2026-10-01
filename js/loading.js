(function () {
    'use strict';

    const CONFIG = {
        serverName: 'R.S.T.',
        serverDescription: 'RUSSIAN SANDBOX SERVER',

        // Замените этот файл на свой логотип:
        logoPath: 'assets/logo/s.png',

        discordUrl: 'https://discord.gg/ВАШ_КОД',
        musicVolume: 0.25,
        backgroundInterval: 10000,
        tipInterval: 7000
    };

    const state = {
        total: 0,
        needed: 0,
        lastProgress: 0,
        currentFile: '',
        serverName: '',
        map: '',
        gamemode: ''
    };

    const $ = (id) => document.getElementById(id);

    const progressFill = $('progressFill');
    const percent = $('percent');
    const status = $('status');
    const progressFoot = $('progressFoot');
    const tip = $('tip');
    const tipTitle = $('tipTitle');
    const tipText = $('tipText');
    const music = $('backgroundMusic');
    const serverLogo = $('serverLogo');
    const logoFallback = $('logoFallback');

    // Советы перенесены из DEMO-версии.
    const tips = [
        ['СОВЕТ', 'Минг в Garry’s Mod — это игрок, который портит другим игровой процесс, хулиганит, спамит предметами (пропами), шумит или мешает на сервере. Не будте ими... Пожалуйста'],
        ['СОВЕТ', 'Быть спичкой для сервера очень тяжело'],
        ['СОВЕТ', 'Используйте окружение в своих интересах.'],
        ['СОВЕТ', 'Командная работа часто важнее скорости.'],
        ['СОВЕТ', 'Если вы тоните нажмите на пробел.'],
        ['СОВЕТ', 'Никогда не трогайте кнопку "E" возле непонятной машины с проводами. Если её сделал другой игрок это бомба. Если её сделал вы это тоже бомба. Поверьте мне, это всегда бомба.'],
        ['СОВЕТ', 'Ой смотрите солнышко выглянуло! Нет ёжик... Это же кара небесная...'],
        ['СОВЕТ', 'Если вы слышите в микрофон детский голос, который кричит "ПАПА МАМА Я В ТЕЛЕВИЗОРЕ!", а потом происходит взрыв просто перезайдите. Лучше потерять 10 секунд, чем здравый рассудок.'],
        ['СОВЕТ', 'Физган это не инструмент, это способ сказать стулу: "Лети, мой прекрасный, вон в ту стену!" А когда он врежется в админа это способ сказать админу: "Боже распили меня болгаркой".'],
        ['СОВЕТ', 'Нет, свастон из пропов это не смешно.'],
        ['СОВЕТ', 'Если вы разом расвризили постройку из более 1000 пропов это значит что вы не против бутылки в жопе'],
        ['СОВЕТ', 'Сахраняйте свои постройки... хотябы раз в 10 минут...'],
        ['СОВЕТ', 'Фурри гитлер симулятор? Че?.'],
        ['СОВЕТ', 'Ты будешь нижним в паровозике.'],
        ['СОВЕТ', 'Внук так и уехал на диване.'],
        ['СОВЕТ', 'Админ знает, где вы живёте, так что будьте вежливы к другим.'],
        ['СОВЕТ', 'Жуть какая, и долго это будет? 3 года. Мать твою...'],
        ['СОВЕТ', 'Трепещи, Перри админос я изобрел североложителинатор.'],
        ['СОВЕТ', 'Когда админ говорит "кто это сделал?", правильный ответ не "АХАХАХАХА".'],
        ['СОВЕТ', 'Если вы заспавнили туалет посреди дороги, уберите его. Водители уже достаточно страдают.'],
        ['СОВЕТ', 'Если вы построили секретную базу, не ставьте над входом табличку "СЕКРЕТНАЯ БАЗА". Это немного портит концепцию.'],
        ['СОВЕТ', 'Если ваш друг поставил кнопку "НЕ НАЖИМАТЬ", он хочет, чтобы вы её нажали. Но ответственность всё равно будет на вас.'],
        ['СОВЕТ', 'Если сервер начал лагать после вашей постройки, просто смотрите на неё и делайте вид, что вы тут ни при чём. И так и так выебут'],
        ['СОВЕТ', 'Поставили проп идеально ровно? Не трогайте его. Никогда. Пусть так и останется.'],
        ['СОВЕТ', 'Турель без владельца это просто очень агрессивный предмет интерьера.'],
        ['СОВЕТ', 'Самая прочная конструкция в Sandbox та, которую никто не трогает.'],
        ['СОВЕТ', 'DarkRP Говно.'],
        ['СОВЕТ', 'Если ты опять заспавнил 300 пропов ради одной стены поздравляю, ты все еще нижний в паровозике.'],
        ['СОВЕТ', 'Не провоцируй админа. Он тоже человек. Просто у него есть ULX.'],
        ['СОВЕТ', 'Если ты дочитал этот совет и всё равно собираешься устроить хаос ладно. Только потом не спрашивай, почему тебя набутылили.'],
        ['СОВЕТ', 'Если ты заспавнил столько пропов, что сервер начал ебать твой FPS возможно, пора остановиться.'],
        ['СОВЕТ', 'Если твой друг говорит "сейчас будет охуенно" отойди подальше. Обычно после этих слов что-нибудь взрывается.'],
        ['СОВЕТ', 'Если твой вертолёт взлетел, сделал сальто и вшатался в стену поздравляем, ты теперь авиаконструктор.'],
        ['СОВЕТ', 'Не ставь турель возле двери, если не хочешь случайно получить пулю в жопу при выходе из туалета.'],
        ['СОВЕТ', 'Не надо прикручивать двигатель к унитазу. Хотя... ладно, прикручивай. Иногда даже это смешно.'],
        ['СОВЕТ', 'Не пытайся доказать админу, что проп "почти не мешает". Если он его уже заметил ты проебался.'],
        ['СОВЕТ', 'Не стреляй по каждой двери. Иногда за ней просто дверь, а не секретная база террористов.'],
        ['СОВЕТ', 'Не пытайся летать на холодильнике. Хотя если получилось поздравляем, NASA уже звонит, или Redbull смотря что больше нравится.'],
        ['СОВЕТ', 'О боже... Оно узнало что такое Е2...'],
        ['СОВЕТ', 'Музыка: TFR OST: The Fire Rises'],
    ];

    // Новые фоновые изображения из DEMO.
    const backgrounds = [
        'assets/backgrounds/screen1.jpg',
        'assets/backgrounds/screen2.jpg',
        'assets/backgrounds/screen3.jpg',
        'assets/backgrounds/screen4.jpg',
        'assets/backgrounds/screen5.jpg',
        'assets/backgrounds/screen6.jpg'
    ];

    // Fisher-Yates: каждый фон/совет показывается один раз
    // до нового перемешивания. Повторов подряд нет.
    function shuffle(array) {
        const result = array.slice();

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }

        return result;
    }

    let tipOrder = [];
    let tipPosition = 0;

    function getNextTip() {
        if (tipPosition >= tipOrder.length) {
            const previous = tipOrder.length ? tipOrder[tipOrder.length - 1] : -1;
            tipOrder = shuffle(tips.map(function (_, index) { return index; }));
            tipPosition = 0;

            // Не допускаем повтор последнего совета на границе циклов.
            if (tipOrder.length > 1 && tipOrder[0] === previous) {
                const swapIndex = 1 + Math.floor(Math.random() * (tipOrder.length - 1));
                const temp = tipOrder[0];
                tipOrder[0] = tipOrder[swapIndex];
                tipOrder[swapIndex] = temp;
            }
        }

        return tipOrder[tipPosition++];
    }

    let backgroundOrder = [];
    let backgroundPosition = 0;

    function getNextBackground() {
        if (backgroundPosition >= backgroundOrder.length) {
            const previous = backgroundOrder.length ? backgroundOrder[backgroundOrder.length - 1] : -1;
            backgroundOrder = shuffle(backgrounds.map(function (_, index) { return index; }));
            backgroundPosition = 0;

            // Не допускаем повтор предыдущего фона на границе циклов.
            if (backgroundOrder.length > 1 && backgroundOrder[0] === previous) {
                const swapIndex = 1 + Math.floor(Math.random() * (backgroundOrder.length - 1));
                const temp = backgroundOrder[0];
                backgroundOrder[0] = backgroundOrder[swapIndex];
                backgroundOrder[swapIndex] = temp;
            }
        }

        return backgroundOrder[backgroundPosition++];
    }

    function setProgress(value) {
        value = Number(value);
        if (!isFinite(value)) return;

        value = Math.max(0, Math.min(100, value));

        // REAL: прогресс никогда не придумывается и не движется назад.
        if (value < state.lastProgress) return;

        state.lastProgress = value;
        progressFill.style.width = value.toFixed(2) + '%';
        percent.textContent = Math.round(value) + '%';
    }

    function updateRealProgress() {
        if (!(state.total > 0)) return;

        const loaded = Math.max(
            0,
            state.total - Math.max(0, state.needed)
        );

        setProgress((loaded / state.total) * 100);

        progressFoot.textContent =
            state.needed > 0
                ? (loaded + ' / ' + state.total + ' ФАЙЛОВ')
                : 'ГОТОВО.';
    }

    function normalizeStatus(value) {
        if (typeof value !== 'string' || !value.trim()) {
            return 'Подключение к серверу...';
        }

        return value.trim();
    }

    function showTip(index) {
        tip.classList.add('is-changing');

        window.setTimeout(function () {
            const item = tips[index];

            tipTitle.textContent = item[0];
            tipText.textContent = item[1];

            tip.classList.remove('is-changing');
        }, 350);
    }

    function rotateTips() {
        // Первый совет также выбирается случайно.
        showTip(getNextTip());

        window.setInterval(function () {
            showTip(getNextTip());
        }, CONFIG.tipInterval);
    }

    function rotateBackgrounds() {
        let active = 0;
        const layers = [$('bgA'), $('bgB')];

        function setLayer(layer, index) {
            layer.style.backgroundImage =
                'url("' + backgrounds[index] + '")';
        }

        // Первый фон — случайный.
        setLayer(layers[0], getNextBackground());
        layers[0].classList.add('visible');

        window.setInterval(function () {
            const target = active === 0 ? 1 : 0;
            const nextIndex = getNextBackground();

            setLayer(layers[target], nextIndex);
            layers[target].classList.add('visible');
            layers[active].classList.remove('visible');

            active = target;
        }, CONFIG.backgroundInterval);
    }

    function startMusic() {
        if (!music) return;

        music.volume = CONFIG.musicVolume;

        const promise = music.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                // Chromium/GMod может заблокировать autoplay.
            });
        }
    }

    window.SetFilesTotal = function (total) {
        state.total = Math.max(0, Number(total) || 0);
        updateRealProgress();
    };

    window.SetFilesNeeded = function (needed) {
        state.needed = Math.max(0, Number(needed) || 0);
        updateRealProgress();
    };

    window.DownloadingFile = function (fileName) {
        state.currentFile =
            typeof fileName === 'string' ? fileName : '';

        if (state.currentFile) {
            status.textContent = 'Загрузка ресурсов...';
            progressFoot.textContent = state.currentFile;
        }
    };

    window.SetStatusChanged = function (value) {
        status.textContent = normalizeStatus(value);

        if (/finished|complete|done|готово/i.test(String(value))) {
            status.textContent = 'Готово.';
        }
    };

    window.GameDetails = function (
        servername,
        serverurl,
        mapname,
        maxplayers,
        steamid,
        gamemode,
        volume,
        language
    ) {
        state.serverName = servername || '';
        state.map = mapname || '';
        state.gamemode = gamemode || '';

        if (state.serverName) {
            $('serverMeta').textContent =
                state.serverName + ' // ONLINE';
        }

        if (typeof volume === 'number' && isFinite(volume)) {
            music.volume = Math.max(
                0,
                Math.min(1, CONFIG.musicVolume * volume)
            );
        }
    };

    if (serverLogo) {
        serverLogo.src = CONFIG.logoPath;

        serverLogo.addEventListener('error', function () {
            serverLogo.style.display = 'none';

            if (logoFallback) {
                logoFallback.style.display = 'block';
            }
        });

        serverLogo.addEventListener('load', function () {
            if (logoFallback) {
                logoFallback.style.display = 'none';
            }
        });
    }

    $('discord').href = CONFIG.discordUrl;
    $('serverMeta').textContent = CONFIG.serverName + ' // ONLINE';
    status.textContent = 'Подключение к серверу...';

    rotateBackgrounds();
    rotateTips();
    startMusic();

    // Запуск музыки после первого взаимодействия,
    // если Chromium заблокировал autoplay.
    document.addEventListener('pointerdown', startMusic, { once: true });
})();
