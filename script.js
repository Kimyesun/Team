// ==========================================
// DOM 로드 완료 후 모든 초기화 및 이벤트 리스너 실행
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 커스텀 알림 모달 설정
    // ==========================================
    const alertModal = document.getElementById('custom-alert-modal');
    const alertText = document.getElementById('custom-alert-text');
    const alertCloseBtn = document.getElementById('custom-alert-close');
    const alertOverlay = alertModal ? alertModal.querySelector('.popup-overlay') : null;

    /**
     * 사용자에게 알림 메시지를 표시하는 함수
     * @param {string} message - 표시할 메시지 내용
     */
    function showAlert(message) {
        if (alertModal && alertText) {
            alertText.textContent = message;
            alertModal.classList.remove('hidden');
        } else {
            alert(message); 
        }
    }

    // 알림 모달 닫기 버튼 이벤트
    if (alertCloseBtn) {
        alertCloseBtn.addEventListener('click', () => {
            alertModal.classList.add('hidden');
        });
    }
    
    if (alertOverlay) {
        alertOverlay.addEventListener('click', () => {
            alertModal.classList.add('hidden');
        });
    }

    // ==========================================
    // 화면 전환 설정 (메인, 로그인, 회원가입, 랭킹)
    // ==========================================
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const rankingLink = document.getElementById('ranking-link');
    const communityLink = document.getElementById('community-link');
    const logo = document.querySelector('.logo');

    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const rankingView = document.getElementById('ranking-view');
    const communityView = document.getElementById('community-view');
    
    const mainWrap = document.querySelector('.wrap');
    const header = document.querySelector('.header');
    
    // 로그인 화면 내의 회원가입 버튼
    const loginSignupBtn = loginView ? loginView.querySelector('.signup-btn') : null;

    // 함수: 모든 화면 숨기기 및 상태 초기화
    function hideAllViews() {
        if (mainWrap) mainWrap.classList.add('hidden');
        if (loginView) loginView.classList.add('hidden');
        if (signupView) signupView.classList.add('hidden');
        if (rankingView) rankingView.classList.add('hidden');
        if (communityView) communityView.classList.add('hidden');

        // 챌린지 모달 숨기기
        const cModal = document.getElementById('challenge-modal');
        if (cModal) cModal.classList.add('hidden');
        
        const oModal = document.getElementById('ongoing-challenge-modal');
        if (oModal) oModal.classList.add('hidden');
        
        // 푸터 표시 (챌린지 링크 등에서 숨겼을 경우 복구)
        const footer = document.querySelector('.footer');
        if (footer) footer.style.display = '';
    }

    // 로고 클릭 시 (홈으로 이동)
    if (logo) {
        logo.addEventListener('click', () => {
             hideAllViews();
             if (mainWrap) mainWrap.classList.remove('hidden');
             if (header) header.classList.remove('hidden'); // 헤더 표시
        });
    }

    // 로그인 링크 클릭 시
    if (loginLink && loginView) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllViews();
            loginView.classList.remove('hidden');
            if (header) header.classList.add('hidden'); // 로그인 시 헤더 숨김
            window.scrollTo(0, 0);
        });
    }

    // 회원가입 링크 클릭 시
    if (signupLink && signupView) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllViews();
            signupView.classList.remove('hidden');
            if (header) header.classList.add('hidden'); // 회원가입 시 헤더 숨김
            window.scrollTo(0, 0);
        });
    }

    // 로그인 화면에서 '회원가입' 버튼 클릭 시
    if (loginSignupBtn && signupView) {
        loginSignupBtn.addEventListener('click', () => {
            hideAllViews();
            signupView.classList.remove('hidden');
            if (header) header.classList.add('hidden');
            window.scrollTo(0, 0);
        });
    }

    // 랭킹 링크 클릭 시
    if (rankingLink && rankingView) {
        rankingLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllViews();
            rankingView.classList.remove('hidden');
            if (header) header.classList.remove('hidden'); // 랭킹 시 헤더 표시
            window.scrollTo(0, 0);
        });
    }

    // 커뮤니티 링크 클릭 시
    if (communityLink && communityView) {
        communityLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllViews();
            communityView.classList.remove('hidden');
            if (header) header.classList.remove('hidden');
            window.scrollTo(0, 0);

            // 커뮤니티 화면에서는 푸터 숨기기
            const footer = document.querySelector('.footer');
            if (footer) footer.style.display = 'none';

            // Community Reward Popup Check
            const rewardModal = document.getElementById('community-reward-modal');
            if (rewardModal) {
                 const today = new Date().toISOString().split('T')[0];
                 const hideDate = localStorage.getItem('hideRewardPopupDate');
                 if (hideDate !== today) {
                     rewardModal.classList.remove('hidden');
                 }
            }
        });
    }


    // ==========================================
    // 타이핑 효과를 위한 Intersection Observer 설정
    // 화면에 요소가 보일 때 글자가 하나씩 타이핑되는 효과
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h2 = entry.target.querySelector('h2');
                
                if (h2 && !h2.classList.contains('typing-started')) {
                    h2.classList.add('typing-started');
                    
                    const text = h2.getAttribute('data-text');
                    let index = 0;
                    
                    function type() {
                        if (index < text.length) {
                            h2.textContent += text.charAt(index);
                            index++;
                            setTimeout(type, 150);
                        }
                    }
                    type();
                }
            }
        });
    }, { threshold: 0.5 });

    const challenge = document.querySelector('.challenge-quicklink');
    if (challenge) {
        observer.observe(challenge);
    }

    // ==========================================
    // 상점 아이템 캐러셀 슬라이더 기능
    // ==========================================
    const shopWrapper = document.querySelector('.shop-items-wrapper');
    const shopPrev = document.querySelector('.shop-nav.prev');
    const shopNext = document.querySelector('.shop-nav.next');

    /**
     * 상점 아이템들의 크기를 업데이트하는 함수
     * 가운데 아이템은 active, 양 옆은 medium, 그 외는 small
     */
    function updateShopClasses() {
        const items = shopWrapper.querySelectorAll('.shop-item');
        items.forEach((item, index) => {
            item.classList.remove('small', 'medium', 'active');
            
            
            if (index === 0 || index === 4) {
                item.classList.add('small');
            } else if (index === 1 || index === 3) {
                item.classList.add('medium');
            } else if (index === 2) {
                item.classList.add('active');
            }
        });
    }

    // 상점 슬라이더 이전/다음 버튼 이벤트
    if (shopWrapper && shopPrev && shopNext) {
        shopPrev.addEventListener('click', () => {
            const items = shopWrapper.querySelectorAll('.shop-item');
            if (items.length > 0) {
                shopWrapper.insertBefore(items[items.length - 1], items[0]);
                updateShopClasses();
            }
        });

        shopNext.addEventListener('click', () => {
            const items = shopWrapper.querySelectorAll('.shop-item');
            if (items.length > 0) {
                shopWrapper.appendChild(items[0]);
                updateShopClasses();
            }
        });
    }

    // ==========================================
    // 챌린지 모달 열기/닫기 기능
    // ==========================================
    const challengeLink = document.getElementById('challenge-link');
    const challengeModal = document.getElementById('challenge-modal');

    if (challengeLink && challengeModal) {
        challengeLink.addEventListener('click', (e) => {
            e.preventDefault();
            challengeModal.classList.remove('hidden');

            const hideSelectors = [
                '.main',
                '.challenge-quicklink',
                '.ranking-quicklink',
                '.shop-quicklink',
                '.community-quicklink',
                '.footer'
            ];

            hideSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'none';
                }
            });
        });
    }

    // ==========================================
    // 진행중인 챌린지 모달과 전체 챌린지 모달 간 전환
    // ==========================================
    const ongoingModal = document.getElementById('ongoing-challenge-modal');
    const goToOngoingLink = document.getElementById('go-to-ongoing-challenges');
    const backToAllLink = document.getElementById('back-to-all-challenges');

    if (goToOngoingLink && ongoingModal && challengeModal) {
        goToOngoingLink.addEventListener('click', (e) => {
            e.preventDefault();
            challengeModal.classList.add('hidden');
            ongoingModal.classList.remove('hidden');
        });
    }

    if (backToAllLink && ongoingModal && challengeModal) {
        backToAllLink.addEventListener('click', (e) => {
            e.preventDefault();
            ongoingModal.classList.add('hidden');
            challengeModal.classList.remove('hidden');
        });
    }

    // ==========================================
    // 챌린지 상세보기 모달 관련 변수 및 기능
    // ==========================================
    const detailButtons = document.querySelectorAll('.detail-btn');
    const detailView = document.getElementById('challenge-detail-view');
    let lastActiveModal = null;

    // 원본 HTML 저장 (초기화를 위한 변수들)
    let originalMembers = '';
    let originalProgress = '';
    // Status grid might be removed in special layout, but we keep original string if needed
    // Actually we are now capturing the whole detailMain.
    
    // Kept for reference but mostly superseded by new logic
    const memberList = detailView ? detailView.querySelector('.member-list') : null;
    if (memberList) originalMembers = memberList.innerHTML;

    // 현재 선택된 챌린지 카드와 데이터
    let currentDetailCard = null;
    let currentDetailChallengeData = null;
    let timerInterval = null;

    // 원본 레이아웃을 복원하기 위해 전체 HTML 저장
    const detailMain = detailView ? detailView.querySelector('.detail-main') : null;
    let originalDetailMain = '';
    if (detailMain) originalDetailMain = detailMain.innerHTML;

    /**
     * 상세보기 화면을 초기 상태로 복원하는 함수
     * 타이머 중지, 멤버 리스트 복원, 레이아웃 복원
     */
    function resetDetailView() {
        if (timerInterval) clearInterval(timerInterval); // Stop any running timer
        if (memberList) memberList.innerHTML = originalMembers;
        // Restore the full main area if we changed it completely
        if (detailMain) detailMain.innerHTML = originalDetailMain;
        
        // Re-bind close button event since we replaced innerHTML
        const newCloseBtn = detailView.querySelector('.close-detail-btn');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', () => {
                detailView.classList.add('hidden');
                if (lastActiveModal) lastActiveModal.classList.remove('hidden');
                else if (ongoingModal) ongoingModal.classList.remove('hidden');
            });
        }
    }

    /**
     * 챌린지 데이터를 바탕으로 상세보기 화면을 업데이트하는 함수
     * 카테고리에 따라 다른 레이아웃을 표시 (study/exercise는 특수 레이아웃)
     * @param {Object} challengeData - 챌린지 데이터 객체
     */
    function updateDetailView(challengeData) {
        const { userName, duration, goal, category } = challengeData;
        const isSpecialCategory = category === 'study' || category === 'exercise';

        if (isSpecialCategory) {
            // ==========================================
            // 특수 레이아웃 (study/exercise): 진행도, 목표, 타이머 표시
            // ==========================================
            
            // 1. 사이드바: 멤버 리스트에 인증 상태 표시
            if (memberList) {
                // Mock data for demonstration
                const members = [
                    { name: userName, status: '인증 완료', type: 'success' },
                    { name: '유태민', status: '미제출', type: 'danger' },
                    { name: '이정민', status: '인증 실패', type: 'warning' },
                    { name: '박현서', status: '미제출', type: 'danger' }
                ];
                
                memberList.innerHTML = members.map(m => `
                    <div class="member-item-status-layout">
                        <div class="member-info-group">
                            <div class="member-avatar">
                                <img src="img/Profile.png" alt="Profile">
                            </div>
                            <span class="member-name">${m.name}</span>
                        </div>
                        <span class="member-status-text ${m.type}">${m.status}</span>
                    </div>
                `).join('');
            }

            // 2. 메인 영역: 진행도, 목표 카드, 타이머 표시
            if (detailMain) {
                // Keep the close button at top
                const closeBtnHTML = `
                <button class="close-detail-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>`;

                // 진행도 카드 HTML
                const progressCardHTML = `
                <div class="detail-card">
                    <h3>챌린지 진행도</h3>
                    <div class="progress-area">
                        <div class="progress-info">
                            <span class="days-elapsed">0일 경과</span>
                            <span class="percentage">0%</span>
                            <span class="days-left">${duration}일 남음</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>`;

                // 목표 카드 HTML (제출버튼 포함)
                const goalCardHTML = `
                <div class="detail-card">
                    <h3>챌린지 목표</h3>
                    <div class="goal-box">${goal}</div>
                    <button class="submit-btn">제출하기</button>
                </div>`;

                // 타이머 카드 HTML
                const timerCardHTML = `
                <div class="detail-card">
                    <h3>타이머</h3>
                    <div class="timer-container">
                        <div class="timer-display" id="timer-val">01:00:00</div>
                        <button class="timer-btn" id="timer-toggle-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>
                </div>`;
                
                const actionsHTML = `
                <div class="detail-actions">
                    <button class="btn-giveup">give up</button>
                    <button class="btn-complete">complete</button>
                </div>`;

                detailMain.innerHTML = closeBtnHTML + progressCardHTML + goalCardHTML + timerCardHTML + actionsHTML;

                // Re-bind actions
                bindDetailActions();

                // Initialize Timer Logic
                initTimer();
            }

        } else {
            // ==========================================
            // 기본 레이아웃 (daily 등): 간단한 멤버 리스트와 참여 현황
            // ==========================================
            
            // 1. 사이드바: 간단한 멤버 리스트
            if (memberList) {
                memberList.innerHTML = `
                <div class="member-item">
                    <div class="member-avatar">
                        <img src="img/Profile.png" alt="Profile">
                    </div>
                    <span class="member-name">${userName}</span>
                </div>`;
            }

            // 2. Main Area (Restore original via resetDetailView, then update content)
            // Note: resetDetailView already restored originalHTML. We just need to update dynamic values.
            
            // Update Goal
            const goalBox = detailMain.querySelector('.goal-box');
            if (goalBox) goalBox.textContent = goal;

            // Update Progress
            const pArea = detailMain.querySelector('.progress-area');
            if (pArea) {
                 pArea.innerHTML = `
                    <div class="progress-info">
                        <span class="days-elapsed">0일 경과</span>
                        <span class="percentage">0%</span>
                        <span class="days-left">${duration}일 남음</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 0%;"></div>
                    </div>
                `;
            }

            // Update Status Grid
            const sGrid = detailMain.querySelector('.status-grid');
            if (sGrid) {
                sGrid.innerHTML = `
                <div class="status-item">
                    <div class="status-user">
                        <div class="status-avatar">
                            <img src="img/Profile.png" alt="Profile">
                        </div>
                        <span>${userName}</span>
                    </div>
                    <span class="status-label danger">미제출</span>
                </div>`;
            }
            
            // Re-bind actions (give up, complete) as the DOM for buttons might be reset
             bindDetailActions();
        }
    }
    
    /**
     * 상세보기 화면의 버튼들(닫기, 포기, 완료, 제출)에 이벤트를 바인딩하는 함수
     */
    function bindDetailActions() {
        // Close Button
        const closeBtn = detailMain.querySelector('.close-detail-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                detailView.classList.add('hidden');
                if (timerInterval) clearInterval(timerInterval);
                if (lastActiveModal) lastActiveModal.classList.remove('hidden');
                else if (ongoingModal) ongoingModal.classList.remove('hidden');
            });
        }

        // Give Up
        const giveUp = detailMain.querySelector('.btn-giveup');
        if (giveUp) {
            giveUp.addEventListener('click', () => {
                 document.getElementById('give-up-modal').classList.remove('hidden');
            });
        }

        // Complete
        const complete = detailMain.querySelector('.btn-complete');
        if (complete) {
            complete.addEventListener('click', () => {
                document.getElementById('challenge-over-modal').classList.remove('hidden');
            });
        }
        
        // Submit button (for special category)
        const submitBtn = detailMain.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                showAlert('인증이 제출되었습니다!');
            });
        }
    }

    /**
     * 타이머 기능을 초기화하는 함수
     * 재생/일시정지 기능과 시간 표시
     */
    function initTimer() {
        const display = document.getElementById('timer-val');
        const btn = document.getElementById('timer-toggle-btn');
        if (!display || !btn) return;

        let totalSeconds = 3600; // 1 hour
        let isRunning = false;
        
        const formatTime = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };

        display.textContent = formatTime(totalSeconds);

        const updateTimer = () => {
            if (totalSeconds > 0) {
                totalSeconds--;
                display.textContent = formatTime(totalSeconds);
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                showAlert('타이머가 종료되었습니다.');
            }
        };

        btn.addEventListener('click', () => {
            if (isRunning) {
                // Pause
                clearInterval(timerInterval);
                isRunning = false;
                // Change icon to Play
                btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
            } else {
                // Start
                timerInterval = setInterval(updateTimer, 1000);
                isRunning = true;
                // Change icon to Pause
                 btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            }
        });
    }

    if (detailButtons.length > 0 && detailView) {
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                resetDetailView();

                const parentModal = btn.closest('.popup-modal') || btn.closest('.modal');
                if (parentModal) {
                    lastActiveModal = parentModal;
                    parentModal.classList.add('hidden');
                } else {
                    if (challengeModal && !challengeModal.classList.contains('hidden')) {
                         lastActiveModal = challengeModal;
                         challengeModal.classList.add('hidden');
                    } else if (ongoingModal && !ongoingModal.classList.contains('hidden')) {
                         lastActiveModal = ongoingModal;
                         ongoingModal.classList.add('hidden');
                    } else {
                        if (challengeModal) challengeModal.classList.add('hidden');
                        if (ongoingModal) ongoingModal.classList.add('hidden');
                    }
                }

                const card = btn.closest('.challenge-card');
                currentDetailCard = card; 
                currentDetailChallengeData = null; 

                // We need to find the challenge data object corresponding to this card to know the category
                // For existing detailed buttons (hardcoded ones), they might not have data.
                // But created ones will invoke the renderChallenge listener, not this one.
                // Wait, renderChallenge adds its own listener.
                // This block is for "initial (hardcoded)" detail buttons.
                
                // Let's assume hardcoded ones are "Daily" for now unless we change index.html data.
                
                // Mock data extraction from DOM for hardcoded cards
                let nameText = '';
                const h3 = card.querySelector('h3');
                if(h3) nameText = h3.textContent;
                
                const infos = card.querySelectorAll('.card-info p');
                let goalText = '';
                let durationText = '30';
                infos.forEach(p => {
                    if (p.textContent.includes('목표 -')) goalText = p.textContent.split('목표 -')[1].trim();
                });
                
                // Default to daily/hobby for existing hardcoded cards
                const mockData = {
                    name: nameText,
                    duration: durationText,
                    goal: goalText,
                    userName: '김예선',
                    category: 'hobby' 
                };

                updateDetailView(mockData);
                detailView.classList.remove('hidden');
            });
        });
    }

    // ==========================================
    // 로고 클릭 시 메인 페이지로 돌아가기 (기존 이벤트 리스너 추가)
    // ==========================================
    // logo는 상단에서 이미 정의됨
    const attendanceSection = document.querySelector('.attendance-section');
    
    
    if (logo) {
        logo.addEventListener('click', () => {
            
            if (challengeModal) challengeModal.classList.add('hidden');
            if (ongoingModal) ongoingModal.classList.add('hidden');
            if (detailView) detailView.classList.add('hidden');
            if (attendanceSection) attendanceSection.classList.add('hidden'); // Hide attendance

            
            const selectors = [
                '.main',
                '.challenge-quicklink',
                '.ranking-quicklink',
                '.shop-quicklink',
                '.community-quicklink',
                '.footer'
            ];

            selectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = '';
                }
            });
        });
    }
    
    // ==========================================
    // 출석체크 페이지 열기
    // ==========================================
    const attendanceLink = document.getElementById('attendance-link');
    if (attendanceLink && attendanceSection) {
        attendanceLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 다른 전체 화면 뷰(랭킹, 로그인 등) 숨기기 및 .wrap 표시
            hideAllViews(); 
            if (mainWrap) mainWrap.classList.remove('hidden');
            if (header) header.classList.remove('hidden'); // 헤더 표시

            // Hide other sections within .wrap
            const selectors = [
                '.main',
                '.challenge-quicklink',
                '.ranking-quicklink',
                '.shop-quicklink',
                '.community-quicklink'
                // '.footer' -> 푸터는 유지할지 여부를 결정해야 하는데, 이전 요청에서 푸터는 항상 있어야 한다고 했으므로 숨김 목록에서 제거
            ];
            
            selectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'none';
                }
            });

            // 푸터가 스타일로 숨겨져 있을 수 있으므로 복구
            const footer = document.querySelector('.footer');
            if (footer) footer.style.display = '';
            
            // Hide modals
            if (challengeModal) challengeModal.classList.add('hidden');
            if (ongoingModal) ongoingModal.classList.add('hidden');
            if (detailView) detailView.classList.add('hidden');
            
            // Show attendance
            attendanceSection.classList.remove('hidden');
        });
    }

    
    const closeDetailBtn = document.querySelector('.close-detail-btn');
    if (closeDetailBtn && detailView) {
        closeDetailBtn.addEventListener('click', () => {
            detailView.classList.add('hidden');
            
            if (lastActiveModal) {
                lastActiveModal.classList.remove('hidden');
            } else if (ongoingModal) {
                
                ongoingModal.classList.remove('hidden');
            }
        });
    }

    // ==========================================
    // 새 챌린지 생성 모달 열기/닫기
    // ==========================================
    const createChallengeBtns = document.querySelectorAll('.create-challenge-btn');
    const createChallengeModal = document.getElementById('create-challenge-modal');
    const createModalOverlay = createChallengeModal ? createChallengeModal.querySelector('.popup-overlay') : null;

    if (createChallengeBtns.length > 0 && createChallengeModal) {
        createChallengeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                createChallengeModal.classList.remove('hidden');
            });
        });
    }

    if (createModalOverlay) {
        createModalOverlay.addEventListener('click', () => {
            createChallengeModal.classList.add('hidden');
        });
    }

    // ==========================================
    // 챌린지 수정 모달 및 기능
    // ==========================================
    const editChallengeModal = document.getElementById('edit-challenge-modal');
    const editModalOverlay = editChallengeModal ? editChallengeModal.querySelector('.popup-overlay') : null;
    const updateChallengeBtn = editChallengeModal ? editChallengeModal.querySelector('.update-challenge-btn') : null;
    
    const editNameInput = document.getElementById('edit-challenge-name');
    const editUserInput = document.getElementById('edit-challenge-user');
    const editDurationInput = document.getElementById('edit-challenge-duration');
    const editCategoryInput = document.getElementById('edit-challenge-category');
    const editGoalInput = document.getElementById('edit-challenge-goal');
    const editCodeInput = document.getElementById('edit-challenge-code');

    // 현재 수정 중인 챌린지 카드와 데이터
    let currentEditingCard = null;
    let currentEditingChallenge = null;

    if (editModalOverlay) {
        editModalOverlay.addEventListener('click', () => {
             editChallengeModal.classList.add('hidden');
        });
    }

    /**
     * 챌린지 수정 모달을 여는 함수
     * @param {HTMLElement} card - 수정할 챌린지 카드 요소
     * @param {Object} challengeData - 챌린지 데이터 객체 (선택사항)
     */
    function openEditModal(card, challengeData = null) {
        currentEditingCard = card;
        currentEditingChallenge = challengeData;

        if (challengeData) {
            editNameInput.value = challengeData.name;
            editUserInput.value = challengeData.userName;
            editDurationInput.value = challengeData.duration;
            editGoalInput.value = challengeData.goal;
            editCodeInput.value = challengeData.code || '';
            if (editCategoryInput) editCategoryInput.value = challengeData.category || '';
        } else {
            
            const nameComp = card.querySelector('.card-top h3');
            const name = nameComp ? nameComp.textContent : '';
            
            const infos = card.querySelectorAll('.card-info p');
            let goal = '';
            infos.forEach(p => {
                if (p.textContent.includes('목표 -')) goal = p.textContent.split('목표 -')[1].trim();
            });
            
             editNameInput.value = name;
             editUserInput.value = ''; 
             editDurationInput.value = 30; 
             editGoalInput.value = goal;
             editCodeInput.value = '';
             if (editCategoryInput) editCategoryInput.value = '';
        }
        
        if (editChallengeModal) editChallengeModal.classList.remove('hidden');
    }

    if (updateChallengeBtn) {
        updateChallengeBtn.addEventListener('click', () => {
             const newName = editNameInput.value;
             const newDuration = parseInt(editDurationInput.value) || 0;
             const newGoal = editGoalInput.value;
             const newUser = editUserInput.value;
             const newCode = editCodeInput.value;
             const newCategory = editCategoryInput ? editCategoryInput.value : '';
             
             if(!newName || !newDuration || !newGoal) {
                 showAlert('모든 필드를 입력해주세요.');
                 return;
             }

            
            if (currentEditingChallenge) {
                
                currentEditingChallenge.name = newName;
                currentEditingChallenge.duration = newDuration;
                currentEditingChallenge.goal = newGoal;
                currentEditingChallenge.userName = newUser;
                currentEditingChallenge.code = newCode;
                currentEditingChallenge.category = newCategory;
                saveChallenges();
                
                
                updateCardDOM(currentEditingCard, currentEditingChallenge.name, currentEditingChallenge.duration, currentEditingChallenge.goal, currentEditingChallenge.createdAt, newCategory);
            } else {
                
                updateCardDOM(currentEditingCard, newName, newDuration, newGoal, new Date(), newCategory);
            }
            
            editChallengeModal.classList.add('hidden');
            showAlert('수정이 완료되었습니다.');
        });
    }

    /**
     * 챌린지 카드의 DOM을 업데이트하는 함수
     * @param {HTMLElement} card - 업데이트할 카드 요소
     * @param {string} name - 챌린지 이름
     * @param {number} duration - 기간(일)
     * @param {string} goal - 목표
     * @param {Date} startDate - 시작일
     * @param {string} category - 카테고리
     */
    function updateCardDOM(card, name, duration, goal, startDate, category) {
         if (!card) return;
         
         const title = card.querySelector('.card-top h3');
         if (title) title.textContent = name;

         const status = card.querySelector('.card-top .status');
         if (status) {
             const categoryMap = {
                 'study': '공부',
                 'exercise': '운동',
                 'daily': '일상'
             };
             const categoryText = categoryMap[category] || '진행 중';
             status.textContent = `(${categoryText})`;
         }

         
         const today = new Date(startDate);
         const endDate = new Date(today);
         endDate.setDate(today.getDate() + duration);
         
         const formatDate = (date) => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
         const dateString = `${formatDate(today)} ~ ${formatDate(endDate)}`;

         const infos = card.querySelectorAll('.card-info p');
         infos.forEach(p => {
             if (p.textContent.includes('기간 -')) p.textContent = `기간 - ${dateString}`;
             if (p.textContent.includes('목표 -')) p.textContent = `목표 - ${goal}`;
         });
    }

    
    const initialEditBtns = document.querySelectorAll('.challenge-card .edit-btn');
    initialEditBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.challenge-card');
            openEditModal(card, null);
        });
    });

    // ==========================================
    // 로컬스토리지를 이용한 챌린지 데이터 관리
    // ==========================================
    let createdChallenges = JSON.parse(localStorage.getItem('createdChallenges')) || [];

    /**
     * 챌린지 데이터를 로컬스토리지에 저장하는 함수
     */
    function saveChallenges() {
        localStorage.setItem('createdChallenges', JSON.stringify(createdChallenges));
    }

    /**
     * 챌린지 데이터를 바탕으로 챌린지 카드를 화면에 렌더링하는 함수
     * @param {Object} challengeData - 렌더링할 챌린지 데이터
     */
    function renderChallenge(challengeData) {
        const { name, duration, goal, userName, createdAt, category } = challengeData;

        
        
        const today = createdAt ? new Date(createdAt) : new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + duration);
        
        const formatDate = (date) => {
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
        };
        
        const dateString = `${formatDate(today)} ~ ${formatDate(endDate)}`;

        const categoryMap = {
             'study': '공부',
             'exercise': '운동',
             'daily': '일상'
         };
         const categoryText = categoryMap[category] || '진행 중';
        
        const newCard = document.createElement('div');
        newCard.classList.add('challenge-card');
        newCard.innerHTML = `
        <div class="card-top">
            <h3>${name}</h3>
            <span class="status">(${categoryText})</span>
        </div>
        <div class="card-info">
            <p>참여 인원 - 현재 한명 참여중</p>
            <p>기간 - ${dateString}</p>
            <p>목표 - ${goal}</p>
        </div>
        <div class="card-bottom">
            <a href="#" class="edit-btn">수정하기→</a>
            <button class="detail-btn">자세히 보기</button>
        </div>
        `;

        
        const newEditBtn = newCard.querySelector('.edit-btn');
        if (newEditBtn) {
            newEditBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openEditModal(newCard, challengeData);
            });
        }

        
        const newDetailBtn = newCard.querySelector('.detail-btn');
        newDetailBtn.addEventListener('click', () => {
            
            if (ongoingModal) {
                lastActiveModal = ongoingModal;
                ongoingModal.classList.add('hidden');
            }
            
            
            currentDetailCard = newCard;
            currentDetailChallengeData = challengeData;

            // Updated to pass the full object
            updateDetailView(challengeData);

            if (detailView) detailView.classList.remove('hidden');
        });

        
        const ongoingGrid = ongoingModal ? ongoingModal.querySelector('.challenge-grid') : null;
        if (ongoingGrid) {
            ongoingGrid.appendChild(newCard);
        }
    }

    // 로컬스토리지에 저장된 챌린지들을 화면에 렌더링
    createdChallenges.forEach(challenge => {
        renderChallenge(challenge);
    });

    // ==========================================
    // 새 챌린지 시작하기 버튼 이벤트
    // ==========================================
    const startChallengeBtn = document.querySelector('.start-challenge-btn');
    if (startChallengeBtn) {
        startChallengeBtn.addEventListener('click', () => {
             const nameInput = document.getElementById('new-challenge-name');
             const userInput = document.getElementById('new-challenge-user');
             const durationInput = document.getElementById('new-challenge-duration');
             const categoryInput = document.getElementById('new-challenge-category');
             const goalInput = document.getElementById('new-challenge-goal');
             const codeInput = document.getElementById('new-challenge-code');
             
             const name = nameInput.value;
             const duration = parseInt(durationInput.value) || 0;
             const goal = goalInput.value;
             const userName = userInput.value;
             // Code is optional
             const code = codeInput ? codeInput.value.trim() : '';
             const category = categoryInput ? categoryInput.value : '';

             if (!name || !duration || !goal) {
                 showAlert('모든 필드를 입력해주세요.');
                 return;
             }
             
             const newChallenge = {
                 name,
                 duration,
                 goal,
                 userName,
                 code,
                 category,
                 createdAt: new Date().toISOString()
             };

             
             createdChallenges.push(newChallenge);
             saveChallenges();

             
             renderChallenge(newChallenge);

             
             createChallengeModal.classList.add('hidden');
             nameInput.value = '';
             userInput.value = '';
             durationInput.value = '';
             goalInput.value = '';
             if(codeInput) codeInput.value = '';
             if(categoryInput) categoryInput.value = '';
             
             
             if (challengeModal) challengeModal.classList.add('hidden');
             if (ongoingModal) ongoingModal.classList.remove('hidden');
        });
    }

    /**
     * 코드를 입력하여 챌린지에 참여하는 함수
     * @param {string} inputSelector - 입력 필드의 CSS 선택자
     */
    function joinChallengeByCode(inputSelector) {
        const input = document.querySelector(inputSelector);
        if (!input) return;
        const code = input.value.trim();
        
        if (!code) {
            showAlert('코드를 입력해주세요.');
            return;
        }

        const challenge = createdChallenges.find(c => c.code === code);
        
        if (challenge) {
            showAlert(`'${challenge.name}' 챌린지에 입장합니다!`);
            
            
            if (challengeModal) challengeModal.classList.add('hidden');
            if (ongoingModal) ongoingModal.classList.add('hidden');
            
            
            lastActiveModal = ongoingModal; 
            
            
            updateDetailView(challenge);
            
            
            if (detailView) detailView.classList.remove('hidden');
            
            
            input.value = '';
        } else {
            showAlert('유효하지 않은 코드입니다.');
        }
    }

    // ==========================================
    // 챌린지 코드 입력 기능 (전체 모달과 진행중 모달에서 모두 사용)
    // ==========================================
    const allCodeBtn = document.getElementById('all-challenge-code-btn');
    const allCodeInput = document.getElementById('all-challenge-code-input');
    
    if (allCodeBtn) {
        allCodeBtn.addEventListener('click', () => joinChallengeByCode('#all-challenge-code-input'));
    }
    if (allCodeInput) {
        allCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') joinChallengeByCode('#all-challenge-code-input');
        });
    }

    const ongoingCodeBtn = document.getElementById('ongoing-challenge-code-btn');
    const ongoingCodeInput = document.getElementById('ongoing-challenge-code-input');

    if (ongoingCodeBtn) {
        ongoingCodeBtn.addEventListener('click', () => joinChallengeByCode('#ongoing-challenge-code-input'));
    }
    if (ongoingCodeInput) {
        ongoingCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') joinChallengeByCode('#ongoing-challenge-code-input');
        });
    }

    // ==========================================
    // 챌린지 포기 모달 기능 (1단계 확인 모달)
    // ==========================================
    const giveUpBtn = document.querySelector('.btn-giveup');
    const giveUpModal = document.getElementById('give-up-modal');
    const giveUpCancelBtn = giveUpModal ? giveUpModal.querySelector('.cancel') : null;
    const giveUpConfirmBtn = giveUpModal ? giveUpModal.querySelector('.giveup') : null;
    const giveUpOverlay = giveUpModal ? giveUpModal.querySelector('.popup-overlay') : null;

    // 2단계 최종 포기 확인 모달 (명언과 함께 표시)
    const finalGiveUpModal = document.getElementById('final-give-up-modal');
    const finalGiveUpCancelBtn = finalGiveUpModal ? finalGiveUpModal.querySelector('.cancel') : null;
    const finalGiveUpConfirmBtn = finalGiveUpModal ? finalGiveUpModal.querySelector('.real-giveup') : null;
    const finalGiveUpOverlay = finalGiveUpModal ? finalGiveUpModal.querySelector('.popup-overlay') : null;

    if (finalGiveUpCancelBtn) {
        finalGiveUpCancelBtn.addEventListener('click', () => {
             finalGiveUpModal.classList.add('hidden');
        });
    }

    if (finalGiveUpOverlay) {
        finalGiveUpOverlay.addEventListener('click', () => {
             finalGiveUpModal.classList.add('hidden');
        });
    }

    if (finalGiveUpConfirmBtn) {
        finalGiveUpConfirmBtn.addEventListener('click', () => {
             finalGiveUpModal.classList.add('hidden');
             
             if (detailView) detailView.classList.add('hidden');
             
             
             let cardName = '';
             if (currentDetailCard) {
                 const h3 = currentDetailCard.querySelector('h3');
                 if (h3) cardName = h3.textContent.trim();
                 currentDetailCard.remove(); 
             }

             
             if (currentDetailChallengeData) {
                 createdChallenges = createdChallenges.filter(c => c !== currentDetailChallengeData);
                 saveChallenges();
             } else if (cardName) {
                 
                 const beforeCount = createdChallenges.length;
                 createdChallenges = createdChallenges.filter(c => c.name !== cardName);
                 if (createdChallenges.length !== beforeCount) saveChallenges();
             }
             
             
             if (ongoingModal && cardName) {
                 
                 const ongoingCards = ongoingModal.querySelectorAll('.challenge-card');
                 ongoingCards.forEach(card => {
                     const h3 = card.querySelector('h3');
                     if (h3 && h3.textContent.trim() === cardName) {
                         card.remove();
                     }
                 });
             }
             
             
             if (challengeModal && cardName) {
                 const allCards = challengeModal.querySelectorAll('.challenge-card');
                 allCards.forEach(card => {
                     const h3 = card.querySelector('h3');
                     if (h3 && h3.textContent.trim() === cardName) {
                         card.remove();
                     }
                 });
             }

             
             if (challengeModal) challengeModal.classList.add('hidden');
             if (ongoingModal) ongoingModal.classList.remove('hidden');
             
             showAlert('챌린지를 삭제했습니다.');
        });
    }

    if (giveUpBtn && giveUpModal) {
        giveUpBtn.addEventListener('click', () => {
             giveUpModal.classList.remove('hidden');
        });
    }

    if (giveUpCancelBtn) {
        giveUpCancelBtn.addEventListener('click', () => {
             giveUpModal.classList.add('hidden');
        });
    }

    if (giveUpOverlay) {
        giveUpOverlay.addEventListener('click', () => {
             giveUpModal.classList.add('hidden');
        });
    }

    if (giveUpConfirmBtn) {
        giveUpConfirmBtn.addEventListener('click', () => {
             giveUpModal.classList.add('hidden');
             if (finalGiveUpModal) finalGiveUpModal.classList.remove('hidden');
        });
    }

    // ==========================================
    // 챌린지 완료 모달 기능 (점수 입력 및 순위 표시)
    // ==========================================
    const completeBtn = document.querySelector('.btn-complete');
    const challengeOverModal = document.getElementById('challenge-over-modal');

    // To remove the ongoing modal when challenge is over
    // ongoingModal is already defined above

    if (completeBtn && challengeOverModal) {
        completeBtn.addEventListener('click', () => {
            challengeOverModal.classList.remove('hidden');

            const scoreView = document.getElementById('challenge-over-score-view');
            const rankingView = document.getElementById('challenge-over-ranking-view');
            
            // Check if category is 'study'
            const isStudy = currentDetailChallengeData && (currentDetailChallengeData.category === 'study');

            if (isStudy) {
                // Show Score Input View
                if (scoreView) scoreView.classList.remove('hidden');
                if (rankingView) rankingView.classList.add('hidden');
                
                // Clear input
                const input = document.getElementById('challenge-score-input');
                if (input) input.value = '';
            } else {
                // Not study (e.g., exercise) - Skip score input, show ranking directly
                // We'll simulate a score or just show ranking logic immediately
                showRankingView(0); // Pass 0 or default score
            }
        });

        /**
         * 최종 순위를 표시하는 함수
         * @param {number} userScore - 사용자가 입력한 점수
         */
        const showRankingView = (userScore) => {
             const scoreView = document.getElementById('challenge-over-score-view');
             const rankingView = document.getElementById('challenge-over-ranking-view');
             
             // Simple simulated ranking data
             const participants = [
                 { name: '김예선', baseScore: 95 },
                 { name: '김예선', baseScore: 88 },
                 { name: '김예선', baseScore: 72 },
                 { name: '김예선', baseScore: 50 }
             ];

             // Add current user
             participants.push({ name: '김예선', score: userScore, isUser: true });

            const rankingData = participants.map(p => {
                if (p.isUser) return p;
                return { name: p.name, score: p.baseScore };
            });

             // Sort by score descending
             rankingData.sort((a, b) => b.score - a.score);

             // Render Ranking View
             const rankingListEl = rankingView.querySelector('.ranking-list');
             if(rankingListEl) {
                 rankingListEl.innerHTML = ''; // Clear previous

                 rankingData.forEach((item, index) => {
                     const rank = index + 1;
                     const points = item.score * 10; // Dummy point calculation
                     const isUserClass = item.isUser ? 'user-rank-item' : '';

                     const html = `
                         <div class="ranking-item ${isUserClass}">
                             <span class="rank">${rank}</span>
                             <span class="name">${item.name}</span>
                             <div class="score-info">
                                 <div class="score-group">
                                     <span class="label">포인트</span>
                                     <span class="value">${points > 0 ? '+' + points : points}</span>
                                 </div>
                                 <div class="divider"></div>
                                 <div class="score-group">
                                     <span class="label">점수</span>
                                     <span class="value">${item.score}</span>
                                 </div>
                             </div>
                         </div>
                     `;
                     rankingListEl.insertAdjacentHTML('beforeend', html);
                 });
             }

             // Switch Views
             if(scoreView) scoreView.classList.add('hidden');
             if(rankingView) rankingView.classList.remove('hidden');
        };

        // Add handler for Confirm Score button
        // const confirmScoreBtn defined later
        
        const overlay = challengeOverModal.querySelector('.popup-overlay');
        const closeX = challengeOverModal.querySelector('.close-challenge-over-x');
        const closeWrapper = challengeOverModal.querySelector('.close-btn-wrapper');
        const confirmScoreBtn = challengeOverModal.querySelector('.confirm-score-btn');

        const closeChallengeOverAndCleanup = () => {
            challengeOverModal.classList.add('hidden');
            
            // Close the detail view as well
            if (detailView) detailView.classList.add('hidden');

            // Delete the completed challenge
            if (currentDetailChallengeData) {
                const idx = createdChallenges.indexOf(currentDetailChallengeData);
                if (idx > -1) {
                    createdChallenges.splice(idx, 1);
                    saveChallenges();
                }
            }
            if (currentDetailCard) {
                currentDetailCard.remove();
            }
            currentDetailCard = null;
            currentDetailChallengeData = null;

            // Restore the previous modal
            if (lastActiveModal) {
                lastActiveModal.classList.remove('hidden');
            } else {
                if (ongoingModal) ongoingModal.classList.add('hidden');
            }
        };

        if (overlay) {
            overlay.addEventListener('click', closeChallengeOverAndCleanup);
        }

        if (closeX || closeWrapper) {
            // Support clicking either the svg or the wrapper div
            const target = closeWrapper || closeX;
            target.addEventListener('click', closeChallengeOverAndCleanup);
        }

        if (confirmScoreBtn) {
            confirmScoreBtn.addEventListener('click', () => {
                // Get the user's score
                const input = document.getElementById('challenge-score-input');
                const userScore = parseInt(input.value) || 0;
                
                showRankingView(userScore);
            });
        }
    }

    // ==========================================
    // 출석체크 카드 클릭 효과 (하루에 한 번만 가능, 자정 이후 가능)
    // ==========================================
    const attCards = document.querySelectorAll('.att-card');
    
    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
    const getTodayDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    
    // 자정까지 남은 시간 계산
    const getTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}시간 ${minutes}분`;
    };
    
    // 스토리지 키 (초기화를 위해 v2로 변경)
    const KEY_LAST_DATE = 'att_last_date_v2';
    const KEY_ATT_COUNT = 'att_count_v2';
    const KEY_CHECKED_INDICES = 'att_indices_v2';

    // 마지막 출석 날짜 가져오기
    let lastAttendanceDate = localStorage.getItem(KEY_LAST_DATE);
    const todayDate = getTodayDate();
    let alreadyCheckedToday = lastAttendanceDate === todayDate;
    
    // 연속 출석 일수 가져오기
    let attendanceCount = parseInt(localStorage.getItem(KEY_ATT_COUNT)) || 0;
    
    // 체크된 카드들의 인덱스 배열 가져오기
    let checkedCardIndices = JSON.parse(localStorage.getItem(KEY_CHECKED_INDICES)) || [];
    
    // 날짜가 바뀌었다면 연속 출석 체크
    if (lastAttendanceDate && lastAttendanceDate !== todayDate) {
        const lastDate = new Date(lastAttendanceDate);
        const today = new Date(todayDate);
        const diffTime = today - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 하루 이상 지났으면 연속 출석이 끊김 (어제 안 찍었으면)
        if (diffDays > 1) {
            attendanceCount = 0;
            // 시각적 초기화는 아래에서 처리하되, 데이터는 리셋
            checkedCardIndices = []; 
            localStorage.setItem(KEY_ATT_COUNT, '0');
            localStorage.setItem(KEY_CHECKED_INDICES, JSON.stringify([]));
            // 이미 찍힌게 있다면 지워줘야 함 (페이지 로드 시 반영됨)
        }
    }
    
    // 페이지 로드 시 이전에 체크한 카드들 표시
    checkedCardIndices.forEach(index => {
        if (attCards[index]) {
            attCards[index].classList.add('checked');
        }
    });
    
    // 연속 출석 카운터 업데이트 함수
    const updateAttendanceCount = (count) => {
        const countElement = document.getElementById('attendance-count');
        if (countElement) {
            countElement.textContent = count;
        }
    };
    
    // 페이지 로드 시 연속 출석 일수 표시
    updateAttendanceCount(attendanceCount);
    
    attCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // 오늘 이미 출석했는지 확인
            if (alreadyCheckedToday) {
                const timeLeft = getTimeUntilMidnight();
                showAlert(`오늘은 이미 출석체크를 완료했습니다!\n다음 출석까지 ${timeLeft} 남았습니다 `);
                return;
            }
            
            // 순서 체크: 다음 찍어야 할 인덱스와 현재 클릭한 인덱스가 일치해야 함
            // 만약 일주일이 다 찼다면(7개), 0번부터 다시 시작
            let nextIndex = checkedCardIndices.length;
            if (nextIndex >= 7) {
                nextIndex = 0;
            }

            // 잘못된 순서 클릭 시
            if (index !== nextIndex) {
                 if (index < nextIndex) {
                     showAlert('이미 완료된 출석입니다!');
                 } else {
                     showAlert('첫 번째 날부터 순서대로 출석해주세요!');
                 }
                 return;
            }

            // 7일 사이클이 돌아서 다시 0번을 찍는 경우, 기존 체크들 초기화
            if (index === 0 && checkedCardIndices.length >= 7) {
                attCards.forEach(c => c.classList.remove('checked'));
                checkedCardIndices = [];
                attendanceCount = 0;
            }
            
            // 출석 완료 처리
            card.classList.add('checked');
            
            // 출석 일수 증가
            attendanceCount++;
            
            // 체크된 카드 인덱스 저장
            checkedCardIndices.push(index);

            // 오늘 체크 플래그 설정
            alreadyCheckedToday = true;
            
            // 로컬스토리지에 저장
            localStorage.setItem(KEY_LAST_DATE, todayDate);
            localStorage.setItem(KEY_ATT_COUNT, attendanceCount.toString());
            localStorage.setItem(KEY_CHECKED_INDICES, JSON.stringify(checkedCardIndices));
            
            // 포인트 정보 가져오기
            const pointElement = card.querySelector('.point');
            if (pointElement) {
                const points = pointElement.textContent;
                showAlert(`출석 완료! ${points}를 획득했습니다! 🎉\n연속 출석: ${attendanceCount}일`);
            }
            
            // 연속 출석 카운터 화면에 업데이트
            updateAttendanceCount(attendanceCount);
            
            // 7일 연속 출석 달성 시
            if (attendanceCount % 7 === 0 && attendanceCount > 0) {
                setTimeout(() => {
                    showAlert('🎊 7일 연속 출석 달성! 보너스 400P를 획득했습니다!');
                }, 500);
            }
        });
    });

    // ==========================================
    // New Post Modal (Notice Board)
    // ==========================================
    const newPostBtn = document.querySelector('.btn-new-post');
    const newPostModal = document.getElementById('new-post-modal');
    
    if (newPostBtn && newPostModal) {
        newPostBtn.addEventListener('click', () => {
            newPostModal.classList.remove('hidden');
        });
        
        // Close on overlay click
        const overlay = newPostModal.querySelector('.popup-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                newPostModal.classList.add('hidden');
            });
        }

        // Handle submit button (Just close for now)
        const submitBtn = newPostModal.querySelector('.notice-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const title = newPostModal.querySelector('.notice-input').value;
                const content = newPostModal.querySelector('.notice-textarea').value;
                
                if(!title.trim() || !content.trim()) {
                    showAlert('제목과 내용을 모두 입력해주세요.');
                    return;
                }

                showAlert('게시글이 성공적으로 등록되었습니다!');
                newPostModal.classList.add('hidden');
                
                // Clear inputs
                newPostModal.querySelector('.notice-input').value = '';
                newPostModal.querySelector('.notice-textarea').value = '';
            });
        }
    }

    // ==========================================
    // Community Reward Popup Logic
    // ==========================================
    const rewardModal = document.getElementById('community-reward-modal');
    if (rewardModal) {
        const rewardConfirmBtn = rewardModal.querySelector('.reward-confirm-btn');
        const rewardCheckbox = rewardModal.querySelector('#dont-show-reward');

        if (rewardConfirmBtn) {
            rewardConfirmBtn.addEventListener('click', () => {
                if (rewardCheckbox && rewardCheckbox.checked) {
                    const today = new Date().toISOString().split('T')[0];
                    localStorage.setItem('hideRewardPopupDate', today);
                }
                rewardModal.classList.add('hidden');
            });
        }
    }

    // ==========================================
    // Community Sidebar Navigation Logic
    // ==========================================
    const menuItems = document.querySelectorAll('.community-sidebar .menu-item');
    const commTitle = document.querySelector('.community-title-section h2');
    const commDesc = document.querySelector('.community-title-section p');
    const communityFeed = document.querySelector('.community-feed');
    
    // Initial feed content to restore later
    const defaultFeedHTML = `
        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">수학 고민러</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 34</span>
                    <span class="comment-count">💬 17</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>미적분 문제 질문이요!</h3>
                <p>치환적분 문제인데 도와주세요</p>
            </div>
        </div>

        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">공부병아리</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 10</span>
                    <span class="comment-count">💬 15</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>기말고사 계획 도와주세요</h3>
                <p>전교 1등이 기말고사 계획 도와주세요!</p>
            </div>
        </div>

        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">역사 덕후</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 24</span>
                    <span class="comment-count">💬 9</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>한국사 정리 노트 공유</h3>
                <p>시대별로 정리한 한국사 노트 공유해요~</p>
            </div>
        </div>
    `;

    // Tips & How-To content
    const tipsFeedHTML = `
        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">수학 고민러</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 34</span>
                    <span class="comment-count">💬 17</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>지메 웨이브 잘하는 꿀팁</h3>
                <p>다시 태어나셈 ㅋ</p>
            </div>
        </div>

        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">공부병아리</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 10</span>
                    <span class="comment-count">💬 15</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>테라리아 아이템 파밍 쉽게 하는법</h3>
                <p>팜 만들어서 잠수 태워 놓으세용</p>
            </div>
        </div>

        <div class="feed-card">
            <div class="feed-header">
                <div class="feed-user-info">
                    <div class="feed-user-avatar"></div>
                    <span class="feed-user-name">역사 덕후</span>
                </div>
                <div class="feed-meta">
                    <span class="like-count">♡ 24</span>
                    <span class="comment-count">💬 9</span>
                </div>
            </div>
            <div class="feed-content">
                <h3>경쟁전 마스터 찍는 법</h3>
                <p>픽을 잘하면 됨 픽 못하는 벌레면 걍 접으셈 ㅉ</p>
            </div>
        </div>
    `;

    // My Post Empty State
    const myPostEmptyHTML = `
        <div class="my-post-empty">
            <div class="empty-emoji">😢</div>
            <div class="empty-title">아직 작성한 글이 없어요 ㅠ.ㅠ</div>
            <div class="empty-subtitle">New Post 버튼을 눌러 새 글을 작성해보세요!</div>
        </div>
    `;

    const pageContent = {
        'menu-popular': {
            title: 'Popular Posts',
            desc: '인기글을 구경해 보세요!',
            feedType: 'default',
            highlightFirst: true
        },
        'menu-tips': {
            title: 'Tips & How-To',
            desc: '다른 사람들의 노하우와 팁을 구경해보세요.',
            feedType: 'tips',
            highlightFirst: true
        },
        'menu-data': {
            title: 'Data Sharing', // Should I revert title? User request didn't specify. Assuming "Latest Community" is default. Wait, user request for Popular was explicit.
            desc: '다양한 질문과 정보를 나누며 커뮤니티를 즐겨보세요',
            feedType: 'default',
            highlightFirst: false
        },
        'menu-mypost': {
            title: 'My Post',
            desc: '내가 작성한 글을 한 눈에 볼 수 있어요',
            feedType: 'empty',
            highlightFirst: false
        },
        // Defaults
        'default': {
            title: 'Community',
            desc: '함께 소통하는 공간입니다.',
            feedType: 'default',
            highlightFirst: false
        }
    };

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const id = item.id;
            const content = pageContent[id] || pageContent['default'];
            
            if(commTitle) commTitle.textContent = content.title;
            if(commDesc) commDesc.textContent = content.desc;

            // Content Switching
            if (content.feedType === 'tips') {
                communityFeed.innerHTML = tipsFeedHTML;
            } else if (content.feedType === 'empty') {
                communityFeed.innerHTML = myPostEmptyHTML;
            } else {
                communityFeed.innerHTML = defaultFeedHTML;
            }

            // Apply highlight if needed
            if (content.highlightFirst) {
                const firstCard = communityFeed.querySelector('.feed-card:first-child');
                if (firstCard) {
                    firstCard.style.border = '3px solid #90D1CA';
                }
            }
        });
    });
});
