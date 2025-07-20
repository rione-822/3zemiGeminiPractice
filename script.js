document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');

    const startButton = document.getElementById('start-button');
    const retryButton = document.getElementById('retry-button');

    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const adContainer = document.getElementById('ad-container');
    const mockWebsite = document.getElementById('mock-website');

    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    const resultTime = document.getElementById('result-time');

    let score = 0;
    let timeLeft = 30;
    let timer;

    // 効果音のパス定義
    const soundPaths = {
        success: 'sounds/success.mp3',
        fail: 'sounds/fail.mp3',
        clear: 'sounds/clear.mp3',
        gameOver: 'sounds/gameover.mp3',
        buttonClick: 'sounds/button_click.mp3',
        virus: 'sounds/virus.mp3'
    };

    // 効果音を再生するヘルパー関数
    function playSound(soundName) {
        const audio = new Audio(soundPaths[soundName]);
        audio.play();
    }

    // --- ゲーム開始・終了処理 ---
    startButton.addEventListener('click', () => {
        playSound('buttonClick');
        startGame();
    });
    retryButton.addEventListener('click', () => {
        playSound('buttonClick');
        startGame();
    });

    function startGame() {
        homeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        // 初期化
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = `スコア: ${score}`;
        timerDisplay.textContent = `制限時間: ${timeLeft}`;
        adContainer.innerHTML = '';

        // タイマー開始
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            if (timeLeft <= 0) {
                endGame(false); // 時間切れ
            }
        }, 1000);

        // ゲーム要素のセットアップ
        setupWebsiteMode();

        // 偽ダウンロードボタンを初期状態に戻す
        const fakeButtons = mockWebsite.querySelectorAll('.fake-download-btn');
        fakeButtons.forEach(button => {
            button.textContent = button.dataset.originalText;
            button.style.backgroundColor = '#28a745'; // 元の緑色に戻す
        });
    }

    function endGame(isClear) {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        if (isClear) {
            const timeBonus = timeLeft * 100;
            score += timeBonus;
            resultTitle.textContent = 'ゲームクリア！';
            resultTime.textContent = `クリアタイム: ${30 - timeLeft}秒 (時間ボーナス: ${timeBonus}点)`;
            playSound('clear'); // クリア音再生
        } else {
            resultTitle.textContent = 'GAME OVER';
            resultTime.textContent = '';
            playSound('gameOver'); // ゲームオーバー音再生
        }
        resultScore.textContent = `スコア: ${score}`;
    }

    // --- 模擬サイトモードのセットアップ ---
    function setupWebsiteMode() {
        // ボタンを生成
        const fakeButton1 = createFakeDownloadButton('今すぐダウンロード (v1.2)');
        const fakeButton2 = createFakeDownloadButton('高速ダウンロードはこちら');
        const realButton = createRealDownloadButton();

        // ボタンを配列に格納し、シャッフル
        const buttons = [fakeButton1, fakeButton2, realButton];
        shuffleArray(buttons);

        // スロットにボタンを配置
        document.getElementById('slot1').innerHTML = '';
        document.getElementById('slot2').innerHTML = '';
        document.getElementById('slot3').innerHTML = '';

        document.getElementById('slot1').appendChild(buttons[0]);
        document.getElementById('slot2').appendChild(buttons[1]);
        document.getElementById('slot3').appendChild(buttons[2]);

        // 広告を5つ生成
        for (let i = 0; i < 5; i++) {
            createAd();
        }
    }

    // --- ボタン生成処理 ---
    function createFakeDownloadButton(text) {
        const button = document.createElement('button');
        button.className = 'fake-download-btn';
        button.textContent = text;
        button.dataset.originalText = text; // 元のテキストを保存

        button.onclick = () => {
            timeLeft -= 10; // 10秒減少
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            button.style.backgroundColor = '#dc3545'; // 赤色に変化
            button.textContent = 'ウイルスに感染しました';
            playSound('virus'); // ウイルス音再生
            if (timeLeft <= 0) {
                endGame(false); // 時間切れ
            }
        };
        return button;
    }

    function createRealDownloadButton() {
        const button = document.createElement('button');
        button.id = 'real-download-btn';
        button.textContent = 'ZipMaster Pro をダウンロード';

        button.onclick = () => {
            endGame(true); // ゲームクリア
        };
        return button;
    }

    // --- 広告生成処理 ---
    function createAd() {
        if (Math.random() < 0.6) {
            createNormalAd();
        } else {
            createFadeInAd();
        }
    }

    function createNormalAd() {
        const ad = createAdElement('通常広告');
        adContainer.appendChild(ad);
    }

    function createFadeInAd() {
        const ad = createAdElement('フェードイン広告');
        ad.classList.add('fade-in');
        adContainer.appendChild(ad);
    }

    function createAdElement(text) {
        const ad = document.createElement('div');
        ad.className = 'ad';
        
        // adContainerの範囲内にランダムに配置
        const adWidth = 200;
        const adHeight = 100;
        ad.style.width = `${adWidth}px`;
        ad.style.height = `${adHeight}px`;
        ad.style.left = `${Math.random() * (adContainer.offsetWidth - adWidth)}px`;
        ad.style.top = `${Math.random() * (adContainer.offsetHeight - adHeight)}px`;

        ad.innerHTML = `
            <div class="close-btn">&times;</div>
            <p>${text}</p>
        `;

        ad.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            score += 100;
            scoreDisplay.textContent = `スコア: ${score}`;
            ad.remove();
            playSound('success'); // 成功音再生
        });

        // 広告本体をクリックした場合の処理
        ad.addEventListener('click', () => {
            timeLeft -= 5; // 5秒減少
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            playSound('fail'); // 失敗音再生
            if (timeLeft <= 0) {
                endGame(false); // 時間切れ
            }
        });

        return ad;
    }

    // 配列をシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});