document.addEventListener('DOMContentLoaded', () => {
    
    const alertModal = document.getElementById('custom-alert-modal');
    const alertText = document.getElementById('custom-alert-text');
    const alertCloseBtn = document.getElementById('custom-alert-close');
    const alertOverlay = alertModal ? alertModal.querySelector('.popup-overlay') : null;

    function showAlert(message) {
        if (alertModal && alertText) {
            alertText.textContent = message;
            alertModal.classList.remove('hidden');
        } else {
            alert(message); 
        }
    }

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

    const shopWrapper = document.querySelector('.shop-items-wrapper');
    const shopPrev = document.querySelector('.shop-nav.prev');
    const shopNext = document.querySelector('.shop-nav.next');

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

    
    const detailButtons = document.querySelectorAll('.detail-btn');
    const detailView = document.getElementById('challenge-detail-view');
    let lastActiveModal = null;

    
    let originalMembers = '';
    let originalProgress = '';
    // Status grid might be removed in special layout, but we keep original string if needed
    // Actually we are now capturing the whole detailMain.
    
    // Kept for reference but mostly superseded by new logic
    const memberList = detailView ? detailView.querySelector('.member-list') : null;
    if (memberList) originalMembers = memberList.innerHTML;

    // The resetDetailView is now defined above to handle full layout reset


    
    let currentDetailCard = null;
    let currentDetailChallengeData = null;
    let timerInterval = null; // Timer interval variable

    // Capture original state of the whole detail main area to support full layout changes
    const detailMain = detailView ? detailView.querySelector('.detail-main') : null;
    let originalDetailMain = '';
    if (detailMain) originalDetailMain = detailMain.innerHTML;

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

    function updateDetailView(challengeData) {
        const { userName, duration, goal, category } = challengeData;
        const isSpecialCategory = category === 'study' || category === 'exercise';

        if (isSpecialCategory) {
            // --- Special Layout for Study/Exercise ---
            
            // 1. Sidebar (Member List with Status)
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

            // 2. Main Area (Progress, Goal with Button, Timer)
            if (detailMain) {
                // Keep the close button at top
                const closeBtnHTML = `
                <button class="close-detail-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>`;

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

                const goalCardHTML = `
                <div class="detail-card">
                    <h3>챌린지 목표</h3>
                    <div class="goal-box">${goal}</div>
                    <button class="submit-btn">제출하기</button>
                </div>`;

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
            // --- Default Layout (Daily, etc.) ---
            
            // 1. Sidebar (Simple Member List)
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

    
    const logo = document.querySelector('.logo');
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
    
    // Attendance Check Logic
    const attendanceLink = document.getElementById('attendance-link');
    if (attendanceLink && attendanceSection) {
        attendanceLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hide other sections
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
                    element.style.display = 'none';
                }
            });
            
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

    
    const editChallengeModal = document.getElementById('edit-challenge-modal');
    const editModalOverlay = editChallengeModal ? editChallengeModal.querySelector('.popup-overlay') : null;
    const updateChallengeBtn = editChallengeModal ? editChallengeModal.querySelector('.update-challenge-btn') : null;
    
    const editNameInput = document.getElementById('edit-challenge-name');
    const editUserInput = document.getElementById('edit-challenge-user');
    const editDurationInput = document.getElementById('edit-challenge-duration');
    const editCategoryInput = document.getElementById('edit-challenge-category');
    const editGoalInput = document.getElementById('edit-challenge-goal');
    const editCodeInput = document.getElementById('edit-challenge-code');

    let currentEditingCard = null;
    let currentEditingChallenge = null;

    if (editModalOverlay) {
        editModalOverlay.addEventListener('click', () => {
             editChallengeModal.classList.add('hidden');
        });
    }

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

    
    let createdChallenges = JSON.parse(localStorage.getItem('createdChallenges')) || [];

    function saveChallenges() {
        localStorage.setItem('createdChallenges', JSON.stringify(createdChallenges));
    }

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

    
    createdChallenges.forEach(challenge => {
        renderChallenge(challenge);
    });

    
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

    
    const giveUpBtn = document.querySelector('.btn-giveup');
    const giveUpModal = document.getElementById('give-up-modal');
    const giveUpCancelBtn = giveUpModal ? giveUpModal.querySelector('.cancel') : null;
    const giveUpConfirmBtn = giveUpModal ? giveUpModal.querySelector('.giveup') : null;
    const giveUpOverlay = giveUpModal ? giveUpModal.querySelector('.popup-overlay') : null;

    
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

    // Challenge Over Modal Logic
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

        // Helper function to render ranking
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

    // Attendance Card Click Effect
    const attCards = document.querySelectorAll('.att-card');
    attCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle check status
            card.classList.toggle('checked');
        });
    });
});
