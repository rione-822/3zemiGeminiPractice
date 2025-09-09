document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startButton = document.getElementById('start-button');
    const retryButton = document.getElementById('retry-button');
    const backToHomeButton = document.getElementById('back-to-home-button');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const adContainer = document.getElementById('ad-container');
    const mockWebsite = document.getElementById('mock-website');
    const mockTitle = document.getElementById('mock-title');
    const mockDescription = document.getElementById('mock-description');
    const mockContentArea = document.getElementById('mock-content-area');
    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    const resultTime = document.getElementById('result-time');
    const resultRank = document.getElementById('result-rank');
    const resultMessage = document.getElementById('result-message');
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    
    // ヘルプ機能のDOM要素
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelpButton = document.getElementById('close-help-button');
    const helpOverlay = document.getElementById('help-overlay');
    const helpItemTitles = document.querySelectorAll('.help-item-title');

    // トロフィー機能のDOM要素
    const trophyButton = document.getElementById('trophy-button');
    const trophyModal = document.getElementById('trophy-modal');
    const closeTrophyButton = document.getElementById('close-trophy-button');
    const trophyOverlay = document.getElementById('trophy-overlay');
    const trophyList = document.getElementById('trophy-list');
    const trophyNotificationContainer = document.getElementById('trophy-notification-container');

    // --- 最高記録関連のDOM要素 ---
    const easyBestScore = document.getElementById('easy-best-score');
    const easyBestRank = document.getElementById('easy-best-rank');
    const normalBestScore = document.getElementById('normal-best-score');
    const normalBestRank = document.getElementById('normal-best-rank');
    const hardBestScore = document.getElementById('hard-best-score');
    const hardBestRank = document.getElementById('hard-best-rank');

    // --- LocalStorage関連 ---
    const storageKey = 'adBreakerGameData';
    let gameData;

    const defaultGameData = {
        bestScores: {
            easy: { score: 0, rank: '-' },
            normal: { score: 0, rank: '-' },
            hard: { score: 0, rank: '-' }
        },
        trophies: {},
        stats: {
            gameOverCount: 0
        }
    };

    // ランクの序列 (SSが最も高い)
    const rankOrder = { 'SS': 5, 'S': 4, 'A': 3, 'B': 2, 'C': 1, 'D': 0, '-': -1 };

    // --- トロフィー定義 ---
    const trophyMasterData = {
        'hard_ss': {
            name: '広告に<br>愛をこめて',
            description: '難易度「むずかしい」でSSランクを取る。',
            icon: '💖'
        },
        'all_s': {
            name: '広告の破壊者',
            description: 'すべての難易度で最高ランクを取る。',
            icon: '💥'
        },
        'no_score_clear': {
            name: '戦わずして<br>完全王者',
            description: '広告を消さずにクリア。',
            icon: '👑'
        },
        'risky_a': {
            name: 'ぼろぼろの<br>パソコンでつかむ勝利',
            description: '偽ダウンロードボタンを3つクリックしながら、ランクA以上を取る。',
            icon: '💻'
        },
        'ten_gameovers': {
            name: '不屈の精神',
            description: 'ゲームオーバーを10回経験する。',
            icon: '💪'
        }
    };


    // --- ゲーム変数 ---
    let score = 0;
    let timeLeft = 30;
    let timer;
    let currentDifficulty = 'easy';
    let fakeButtonClickCount = 0; // 偽ボタンクリックカウンター

    // --- 難易度設定 ---
    const difficultySettings = {
        easy: {
            timeLimit: 20,
            adCount: 10,
            adTypes: ['normal', 'fadeIn'],
            fakeButtonCount: 2,
            fakeButtonColors: ['#28a745', '#28a745'],
            fakeButtonTexts: ['今すぐダウンロード', '無料ダウンロードはこちら'],
            website: {
                title: '究極のファイル圧縮ツール「ZipMaster Pro」',
                description: '「ZipMaster Pro」へようこそ！このツールは、最新のアルゴリズムを使用して、ファイルを驚くほど高速かつ効率的に圧縮します。大切なデータを安全に、そして最小のサイズで保管しましょう。',
                contentBlocks: [
                    '<h3>主な機能</h3><ul><li>超高速な圧縮と展開</li><li>多様なフォーマットに対応 (ZIP, RAR, 7z)</li><li>強力な暗号化機能</li></ul>'
                ]
            }
        },
        normal: {
            timeLimit: 40,
            adCount: 20,
            adTypes: ['normal', 'fadeIn', 'popup'],
            fakeButtonCount: 4,
            fakeButtonColors: ['#28a745', '#28a745', '#007bff', '#007bff'],
            fakeButtonTexts: ['高速ダウンロード', 'Download (v2.1)', '無料取得', 'インストール'],
            website: {
                title: '超高機能！動画編集ソフト「MovieCreator X」',
                description: '「MovieCreator X」を使えば、プロ級の動画が誰でも簡単に作成可能！豊富なエフェクトと直感的な操作で、あなたの創造性を最大限に引き出します。',
                contentBlocks: [
                    '<h3>豊富なテンプレート</h3><p>初心者でも安心！プロがデザインしたテンプレートを使えば、数クリックでスタイリッシュな動画が完成します。</p>',
                    '<h3>AIによる自動編集</h3><p>面倒なカット編集や色調補正はAIにおまかせ。あなたは最高のシーンを選ぶだけです。</p>'
                ]
            }
        },
        hard: {
            timeLimit: 50,
            adCount: 25,
            adTypes: ['normal', 'fadeIn', 'popup', 'doubleClose'],
            fakeButtonCount: 5,
            fakeButtonColors: ['#007bff', '#007bff', '#007bff', '#007bff', '#007bff'],
            fakeButtonTexts: ['DOWNLOAD', 'Get Now', '無料セットアップ', '今すぐダウンロード', 'Download v3.0 Final'],
            website: {
                title: '【業界最先端】セキュリティソフト「Guardian Pro」',
                description: '「Guardian Pro」は、ウイルス、マルウェア、ランサムウェアからあなたのPCを鉄壁防御。世界最高水準の検出率で、オンラインの脅威を未然に防ぎます。',
                contentBlocks: [
                    '<h3>リアルタイム保護</h3><p>24時間365日、システムを監視。不審な挙動を即座に検知し、脅威を未然にブロックします。</p>',
                    '<h3>フィッシング対策</h3><p>巧妙な偽サイトや詐欺メールを自動で判別。あなたの個人情報と財産を守ります。</p>',
                    '<h3>軽量動作</h3><p>高度な保護機能を提供しながらも、PCのパフォーマンスへの影響は最小限。ゲームや作業の邪魔をしません。</p>'
                ]
            }
        }
    };

    // --- 効果音 ---
    const soundPaths = {
        success: 'sounds/success.mp3',
        fail: 'sounds/fail.mp3',
        clear: 'sounds/clear.mp3',
        gameOver: 'sounds/gameover.mp3',
        buttonClick: 'sounds/button_click.mp3',
        backToHome: 'sounds/back_to_home_button.mp3',
        difficultySelect: 'sounds/difficulty_select.mp3',
        ssSuccess: 'sounds/ss_success.mp3',
        virus: 'sounds/virus.mp3',
        helpOpen: 'sounds/help_button.mp3',
        helpClose: 'sounds/help_close_button.mp3',
        trophyUnlock: 'sounds/torfy_get.mp3', // トロフィー獲得音
        trophyOpen: 'sounds/torfy_button.mp3',
        trophyClose: 'sounds/torfy_close_button.mp3'
    };

    // --- 関数定義 ---
    function playSound(soundName) {
        const audio = new Audio(soundPaths[soundName]);
        audio.play();
    }

    // --- データ管理関数 ---
    function loadGameData() {
        const data = localStorage.getItem(storageKey);
        gameData = data ? JSON.parse(data) : JSON.parse(JSON.stringify(defaultGameData)); // Deep copy
        // データ構造が古い場合に備えて、デフォルトとマージする
        if (!gameData.bestScores) gameData.bestScores = defaultGameData.bestScores;
        if (!gameData.trophies) gameData.trophies = defaultGameData.trophies;
        if (!gameData.stats) gameData.stats = defaultGameData.stats;
        if (gameData.stats.gameOverCount === undefined) gameData.stats.gameOverCount = 0;
        
        displayBestScores();
        displayTrophies();
    }

    function saveGameData() {
        localStorage.setItem(storageKey, JSON.stringify(gameData));
    }

    function displayBestScores() {
        const scores = gameData.bestScores;
        easyBestScore.textContent = scores.easy.score > 0 ? scores.easy.score : '記録なし';
        easyBestRank.textContent = scores.easy.rank;
        normalBestScore.textContent = scores.normal.score > 0 ? scores.normal.score : '記録なし';
        normalBestRank.textContent = scores.normal.rank;
        hardBestScore.textContent = scores.hard.score > 0 ? scores.hard.score : '記録なし';
        hardBestRank.textContent = scores.hard.rank;
    }

    function updateBestScore(difficulty, newScore, newRank) {
        const currentBest = gameData.bestScores[difficulty];
        let updated = false;
        if (newScore > currentBest.score) {
            currentBest.score = newScore;
            updated = true;
        }
        if (rankOrder[newRank] > rankOrder[currentBest.rank]) {
            currentBest.rank = newRank;
            updated = true;
        }
        if (updated) {
            saveGameData();
            displayBestScores();
        }
    }

    // --- トロフィー関連関数 ---
    function showTrophyNotification(trophyId) {
        const trophy = trophyMasterData[trophyId];
        if (!trophy) return;

        const notification = document.createElement('div');
        notification.className = 'trophy-notification';
        notification.innerHTML = `🏆 トロフィー獲得！<br>「${trophy.name}」`;
        
        trophyNotificationContainer.appendChild(notification);

        playSound('trophyUnlock');

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    function displayTrophies() {
        trophyList.innerHTML = '';
        for (const id in trophyMasterData) {
            const trophy = trophyMasterData[id];
            const isUnlocked = gameData.trophies[id];

            const item = document.createElement('div');
            item.className = 'trophy-item';
            if (isUnlocked) {
                item.classList.add('unlocked');
            }

            item.innerHTML = `
                <div class="trophy-icon">${trophy.icon}</div>
                <div class="trophy-details">
                    <div class="trophy-name">${isUnlocked ? trophy.name : '？？？'}</div>
                    <div class="trophy-description">${isUnlocked ? trophy.description : '（条件を達成すると解除）'}</div>
                </div>
            `;
            trophyList.appendChild(item);
        }
    }

    function checkAndUnlockTrophies(difficulty, finalScore, finalRank, isClear) {
        let newTrophyUnlocked = false;

        // --- 各トロフィーの条件判定 ---

        // 1. 広告に愛をこめて (hard_ss)
        if (!gameData.trophies['hard_ss'] && difficulty === 'hard' && finalRank === 'SS') {
            gameData.trophies['hard_ss'] = true;
            showTrophyNotification('hard_ss');
            newTrophyUnlocked = true;
        }

        // 2. 戦わずして完全王者 (no_score_clear)
        if (!gameData.trophies['no_score_clear'] && isClear && finalScore === (timeLeft * 30)) { // タイムボーナスのみ
            gameData.trophies['no_score_clear'] = true;
            showTrophyNotification('no_score_clear');
            newTrophyUnlocked = true;
        }
        
        // 3. ぼろぼろのパソコンでつかむ勝利 (risky_a)
        if (!gameData.trophies['risky_a'] && isClear && fakeButtonClickCount >= 3 && rankOrder[finalRank] >= rankOrder['A']) {
            gameData.trophies['risky_a'] = true;
            showTrophyNotification('risky_a');
            newTrophyUnlocked = true;
        }

        // 4. 不屈の精神 (ten_gameovers)
        if (!gameData.trophies['ten_gameovers'] && gameData.stats.gameOverCount >= 10) {
            gameData.trophies['ten_gameovers'] = true;
            showTrophyNotification('ten_gameovers');
            newTrophyUnlocked = true;
        }

        // 5. 広告の破壊者 (all_s) - 全ての記録更新後にチェック
        if (!gameData.trophies['all_s']) {
            const bests = gameData.bestScores;
            if (bests.easy.rank === 'S' && bests.normal.rank === 'S' && bests.hard.rank === 'SS') {
                gameData.trophies['all_s'] = true;
                showTrophyNotification('all_s');
                newTrophyUnlocked = true;
            }
        }

        if (newTrophyUnlocked) {
            saveGameData();
            displayTrophies(); // モーダル表示を更新
        }
    }


    // --- ゲームのメイン処理 ---
    function startGame(difficulty) {
        homeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        const settings = difficultySettings[difficulty];

        // 初期化
        score = 0;
        timeLeft = settings.timeLimit;
        fakeButtonClickCount = 0; // カウンターリセット
        scoreDisplay.textContent = `スコア: ${score}`;
        timerDisplay.textContent = `制限時間: ${timeLeft}`;
        adContainer.innerHTML = '';
        resultMessage.classList.remove('fade-in-message');

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            if (timeLeft <= 0) {
                endGame(false, settings.timeLimit);
            }
        }, 1000);

        setupWebsiteMode(settings);
    }

    function endGame(isClear, initialTime) {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        let finalRank = '';
        let finalScore = score;

        if (isClear) {
            const timeBonus = timeLeft * 30;
            finalScore += timeBonus;
            resultTitle.textContent = 'ゲームクリア！';
            resultTime.textContent = `クリアタイム: ${initialTime - timeLeft}秒 (時間ボーナス: ${timeBonus}点)`;
            
            // ランク判定
            let message = '';
            const scoreThresholds = {
                easy: { S: 1500, A: 1200, B: 900, C: 600, D: 0 },
                normal: { S: 3000, A: 2400, B: 1800, C: 1200, D: 0 },
                hard: { SS: 4600, S: 4300, A: 3300, B: 2300, C: 1300, D: 0 }
            };
            const thresholds = scoreThresholds[currentDifficulty];

            if (currentDifficulty === 'hard' && finalScore >= thresholds.SS) {
                finalRank = 'SS'; message = 'あなたは愛を持って広告をせん滅した\nあなたはプロの広告スナイパーだ'; playSound('ssSuccess');
            } else if (finalScore >= thresholds.S) {
                finalRank = 'S'; message = 'あなたの華麗な指は広告の天敵になった'; playSound('clear');
            } else if (finalScore >= thresholds.A) {
                finalRank = 'A'; message = '広告はあなたのカーソルさばきにおびえている'; playSound('clear');
            } else if (finalScore >= thresholds.B) {
                finalRank = 'B'; message = 'あなたは広告消しの才能にめざめた'; playSound('clear');
            } else if (finalScore >= thresholds.C) {
                finalRank = 'C'; message = 'あなたはより高みをめざすことができる'; playSound('clear');
            } else {
                finalRank = 'D'; message = '広告とのたたかいはまだ始まったばかりだ'; playSound('clear');
            }
            
            if (score === 0) { // 広告を一度も消していない場合
                 message = 'あなたは素晴らしい寛容さをもって広告を見逃した\nあなたの目に憎しみはない';
            }

            resultRank.textContent = `ランク: ${finalRank}`;
            resultMessage.innerHTML = message.replace(/\n/g, '<br>');
            resultMessage.classList.add('fade-in-message');

            updateBestScore(currentDifficulty, finalScore, finalRank);

        } else {
            // ゲームオーバー時
            resultTitle.textContent = 'GAME OVER';
            resultTime.textContent = '';
            playSound('gameOver');
            resultRank.textContent = '';
            resultMessage.innerHTML = 'あなたは広告の海におぼれた<br>あなたの中に広告への闘志がめばえた';
            resultMessage.classList.add('fade-in-message');
            
            gameData.stats.gameOverCount++; // ゲームオーバー回数をカウント
            saveGameData();
        }
        
        resultScore.textContent = `スコア: ${finalScore}`;
        
        // トロフィーチェック
        checkAndUnlockTrophies(currentDifficulty, finalScore, finalRank, isClear);
    }

    // --- 模擬サイトのセットアップ ---
    function setupWebsiteMode(settings) {
        mockTitle.textContent = settings.website.title;
        mockDescription.textContent = settings.website.description;
        mockContentArea.innerHTML = '';

        const buttons = [];
        const fakeTexts = [...settings.fakeButtonTexts];
        shuffleArray(fakeTexts);

        for (let i = 0; i < settings.fakeButtonCount; i++) {
            buttons.push(createFakeDownloadButton(fakeTexts[i], settings.fakeButtonColors[i], settings.adTypes.includes('popup')));
        }
        buttons.push(createRealDownloadButton(settings));
        shuffleArray(buttons);

        const contentBlocks = [...settings.website.contentBlocks];
        const totalItems = buttons.length + contentBlocks.length;
        let buttonIndex = 0;
        let contentIndex = 0;

        const leadText = document.createElement('p');
        leadText.textContent = '以下のボタンからダウンロードしてください。';
        mockContentArea.appendChild(leadText);

        for (let i = 0; i < totalItems; i++) {
            if ((i % 2 === 0 && buttonIndex < buttons.length) || contentIndex >= contentBlocks.length) {
                if (buttonIndex < buttons.length) {
                    const slot = createButtonSlot();
                    slot.appendChild(buttons[buttonIndex]);
                    mockContentArea.appendChild(slot);
                    buttonIndex++;
                }
            } else {
                if (contentIndex < contentBlocks.length) {
                    const textDiv = document.createElement('div');
                    textDiv.innerHTML = contentBlocks[contentIndex];
                    mockContentArea.appendChild(textDiv);
                    contentIndex++;
                }
            }
        }

        for (let i = 0; i < settings.adCount; i++) {
            createAd(settings.adTypes);
        }
    }

    function createButtonSlot() {
        const slot = document.createElement('div');
        slot.className = 'button-slot';
        return slot;
    }

    // --- ボタン生成 ---
    function createFakeDownloadButton(text, color, createPopup) {
        const button = document.createElement('button');
        button.className = 'fake-download-btn';
        button.textContent = text;
        button.style.backgroundColor = color;

        button.onclick = () => {
            fakeButtonClickCount++; // カウント
            button.style.backgroundColor = '#dc3545';
            button.textContent = 'ウイルスに感染しました';
            button.disabled = true;

            playSound('virus');
            if (createPopup) {
                createPopupAd();
                timeLeft -= 5;
            } else {
                timeLeft -= 10;
            }
            
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            if (timeLeft <= 0) {
                endGame(false, difficultySettings[currentDifficulty].timeLimit);
            }
        };
        return button;
    }

    function createRealDownloadButton(settings) {
        const button = document.createElement('button');
        button.id = 'real-download-btn';
        button.textContent = `${settings.website.title.split('「')[1].split('」')[0]} をダウンロード`;
        button.onclick = () => {
            endGame(true, difficultySettings[currentDifficulty].timeLimit);
        };
        return button;
    }

    // --- 広告生成 ---
    function createAd(allowedTypes) {
        const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
        
        switch (type) {
            case 'fadeIn': createFadeInAd(); break;
            case 'doubleClose': createDoubleCloseAd(); break;
            case 'popup': createNormalAd(); break; // Fallback
            case 'normal':
            default: createNormalAd(); break;
        }
    }

    function createNormalAd() {
        const ad = createAdElement({ text: '通常広告', score: 100, penalty: 5 });
        adContainer.appendChild(ad);
    }

    function createFadeInAd() {
        const ad = createAdElement({ text: 'フェードイン広告', score: 150, penalty: 7 });
        ad.classList.add('fade-in');
        adContainer.appendChild(ad);
    }
    
    function createDoubleCloseAd() {
        const ad = createAdElement({ text: '二重バツ広告', score: 250, penalty: 10, type: 'double' });
        ad.classList.add('double-close-ad');
        adContainer.appendChild(ad);
    }

    function createPopupAd() {
        const ad = createAdElement({
            text: '<h4>警告！</h4><p>あなたのPCはウイルスに感染しています</p>',
            score: 0, penalty: 15, type: 'popup', width: 300, height: 150
        });
        ad.classList.add('virus-popup');
        ad.style.left = '50%';
        ad.style.top = '50%';
        ad.style.transform = 'translate(-50%, -50%)';
        ad.style.zIndex = '200';
        adContainer.appendChild(ad);
    }

    function createAdElement(options) {
        const { text, score: adScore, penalty, type = 'normal', width = 200, height = 100 } = options;
        const ad = document.createElement('div');
        ad.className = 'ad';
        ad.style.width = `${width}px`;
        ad.style.height = `${height}px`;

        if (type !== 'popup') {
            ad.style.left = `${Math.random() * (adContainer.offsetWidth - width)}px`;
            ad.style.top = `${Math.random() * (adContainer.offsetHeight - height)}px`;
        }

        let closeButtonsHTML = '<div class="close-btn right">&times;</div>';
        if (type === 'double') {
            closeButtonsHTML = '<div class="close-btn left">&times;</div><div class="close-btn right fake">&times;</div>';
        }

        ad.innerHTML = `${closeButtonsHTML}${text}`;

        ad.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'double') {
                    if (btn.classList.contains('left')) {
                        score += adScore;
                        playSound('success');
                        ad.remove();
                    } else {
                        timeLeft -= penalty;
                        playSound('fail');
                    }
                } else {
                    if(adScore > 0) {
                        score += adScore;
                        playSound('success');
                    }
                    ad.remove();
                }
                scoreDisplay.textContent = `スコア: ${score}`;
                timerDisplay.textContent = `制限時間: ${timeLeft}`;
                if (timeLeft <= 0) endGame(false, difficultySettings[currentDifficulty].timeLimit);
            });
        });

        ad.addEventListener('click', () => {
            timeLeft -= penalty;
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            playSound('fail');
            if (timeLeft <= 0) {
                endGame(false, difficultySettings[currentDifficulty].timeLimit);
            }
        });

        return ad;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- イベントリスナー登録 ---
    startButton.addEventListener('click', () => {
        playSound('buttonClick');
        currentDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
        startGame(currentDifficulty);
    });

    retryButton.addEventListener('click', () => {
        playSound('buttonClick');
        startGame(currentDifficulty);
    });

    backToHomeButton.addEventListener('click', () => {
        playSound('backToHome');
        resultScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    });

    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            playSound('difficultySelect');
        });
    });

    // ヘルプモーダル
    helpButton.addEventListener('click', () => {
        playSound('helpOpen'); // 同じ音で良いか
        helpModal.classList.remove('hidden');
    });
    closeHelpButton.addEventListener('click', () => {
        playSound('helpClose');
        helpModal.classList.add('hidden');
    });
    helpOverlay.addEventListener('click', () => {
        playSound('helpClose');
        helpModal.classList.add('hidden');
    });
    helpItemTitles.forEach(title => {
        title.addEventListener('click', () => {
            playSound('difficultySelect');
            title.classList.toggle('active');
            const content = title.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // トロフィーモーダル
    trophyButton.addEventListener('click', () => {
        playSound('trophyOpen'); // 同じ音で良いか
        displayTrophies(); // 開くたびに最新の状態を表示
        trophyModal.classList.remove('hidden');
    });
    closeTrophyButton.addEventListener('click', () => {
        playSound('trophyClose');
        trophyModal.classList.add('hidden');
    });
    trophyOverlay.addEventListener('click', () => {
        playSound('trophyClose');
        trophyModal.classList.add('hidden');
    });


    // --- 初期化処理 ---
    loadGameData();
});

// ウィンドウリサイズ時に広告の位置を再調整 (いつやったのか分からない)
window.addEventListener('resize', () => {
    const ads = document.querySelectorAll('.ad');
    const container = document.getElementById('ad-container');
    if (!container) return;
    ads.forEach(ad => {
        const adRect = ad.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (adRect.right > containerRect.right) {
            ad.style.left = `${containerRect.width - adRect.width}px`;
        }
        if (adRect.bottom > containerRect.bottom) {
            ad.style.top = `${containerRect.height - adRect.height}px`;
        }
    });
});
