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

    // --- ゲーム変数 ---
    let score = 0;
    let timeLeft = 30;
    let timer;
    let currentDifficulty = 'easy';

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
        virus: 'sounds/virus.mp3'
    };

    function playSound(soundName) {
        const audio = new Audio(soundPaths[soundName]);
        audio.play();
    }

    // --- イベントリスナー ---
    startButton.addEventListener('click', () => {
        playSound('buttonClick');
        currentDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
        startGame(currentDifficulty);
    });

    retryButton.addEventListener('click', () => {
        playSound('buttonClick');
        startGame(currentDifficulty); // 前回と同じ難易度で再挑戦
    });

    backToHomeButton.addEventListener('click', () => {
        playSound('backToHome');
        resultScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    });

    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            playSound('difficultySelect');
        });
    });

    // --- ゲームのメイン処理 ---
    function startGame(difficulty) {
        homeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        const settings = difficultySettings[difficulty];

        // 初期化
        score = 0;
        timeLeft = settings.timeLimit;
        scoreDisplay.textContent = `スコア: ${score}`;
        timerDisplay.textContent = `制限時間: ${timeLeft}`;
        adContainer.innerHTML = '';
        resultMessage.classList.remove('fade-in-message'); // アニメーションクラスを削除

        // タイマー開始
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `制限時間: ${timeLeft}`;
            if (timeLeft <= 0) {
                endGame(false, settings.timeLimit);
            }
        }, 1000);

        // ゲーム要素のセットアップ
        setupWebsiteMode(settings);
    }

    function endGame(isClear, initialTime) {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        if (isClear) {
            const timeBonus = timeLeft * 30; // 難易度に関わらずボーナス係数は固定
            score += timeBonus;
            resultTitle.textContent = 'ゲームクリア！';
            resultTime.textContent = `クリアタイム: ${initialTime - timeLeft}秒 (時間ボーナス: ${timeBonus}点)`;
        } else {
            resultTitle.textContent = 'GAME OVER';
            resultTime.textContent = '';
            playSound('gameOver');
        }
        resultScore.textContent = `スコア: ${score}`;

        // ランク判定
        let rank = '';
        let message = '';

        if (isClear) {
            // スコアが0の場合の特別なメッセージ
            if ((score - timeLeft * 30) === 0) { // タイムボーナスを最終スコアから引いている
                rank = 'D'; // スコア0なのでDランクとする
                message = 'あなたは素晴らしい寛容さをもって広告を見逃した\nあなたの目に憎しみはない';
                playSound('clear'); // 通常クリアの音を再生
            } else {
                // 既存のランク判定ロジック
                const scoreThresholds = {
                    easy: { S: 1500, A: 1200, B: 900, C: 600, D: 0 },
                    normal: { S: 3000, A: 2400, B: 1800, C: 1200, D: 0 },
                    hard: { SS: 4600, S: 4300, A: 3300, B: 2300, C: 1300, D: 0 }
                };

                const thresholds = scoreThresholds[currentDifficulty];

                if (currentDifficulty === 'hard' && score >= thresholds.SS) {
                    rank = 'SS';
                    message = 'あなたは愛を持って広告をせん滅した\nあなたはプロの広告スナイパーだ';
                    playSound('ssSuccess'); // SSランクの音を再生
                } else if (score >= thresholds.S) {
                    rank = 'S';
                    message = 'あなたの華麗な指は広告の天敵になった';
                    playSound('clear'); // 通常クリアの音を再生
                } else if (score >= thresholds.A) {
                    rank = 'A';
                    message = '広告はあなたのカーソルさばきにおびえている';
                    playSound('clear'); // 通常クリアの音を再生
                } else if (score >= thresholds.B) {
                    rank = 'B';
                    message = 'あなたは広告消しの才能にめざめた';
                    playSound('clear'); // 通常クリアの音を再生
                } else if (score >= thresholds.C) {
                    rank = 'C';
                    message = 'あなたはより高みをめざすことができる';
                    playSound('clear'); // 通常クリアの音を再生
                } else {
                    rank = 'D';
                    message = '広告とのたたかいはまだ始まったばかりだ';
                    playSound('clear'); // 通常クリアの音を再生
                }
            }
            resultRank.textContent = `ランク: ${rank}`;
            resultMessage.innerHTML = message.replace(/\n/g, '<br>');
            resultMessage.classList.add('fade-in-message'); // アニメーションクラスを追加
        } else {
            // ゲームオーバー時
            resultRank.textContent = ''; // ランクは非表示
            resultMessage.innerHTML = 'あなたは広告の海におぼれた<br>あなたの中に広告への闘志がめばえた'; // メッセージは表示
            resultMessage.classList.add('fade-in-message'); // アニメーションクラスを追加
        }
    }

    // --- 模擬サイトのセットアップ ---
    function setupWebsiteMode(settings) {
        // サイト情報の更新
        mockTitle.textContent = settings.website.title;
        mockDescription.textContent = settings.website.description;
        mockContentArea.innerHTML = ''; // コンテンツエリアをクリア

        // ボタンを生成
        const buttons = [];
        const fakeTexts = [...settings.fakeButtonTexts];
        shuffleArray(fakeTexts);

        for (let i = 0; i < settings.fakeButtonCount; i++) {
            buttons.push(createFakeDownloadButton(fakeTexts[i], settings.fakeButtonColors[i], settings.adTypes.includes('popup')));
        }
        buttons.push(createRealDownloadButton(settings));
        shuffleArray(buttons);

        // コンテンツを動的に構築
        const contentBlocks = [...settings.website.contentBlocks];
        const totalItems = buttons.length + contentBlocks.length;
        let buttonIndex = 0;
        let contentIndex = 0;

        // ダウンロード案内文を追加
        const leadText = document.createElement('p');
        leadText.textContent = '以下のボタンからダウンロードしてください。';
        mockContentArea.appendChild(leadText);

        // ボタンとテキストブロックを交互に配置
        for (let i = 0; i < totalItems; i++) {
            // ボタンを多めに配置する
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

        // 広告を生成
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
                    } else {}
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
});

