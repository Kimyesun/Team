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
    let originalStatus = '';
    
    const memberList = detailView ? detailView.querySelector('.member-list') : null;
    const progressArea = detailView ? detailView.querySelector('.progress-area') : null;
    const statusGrid = detailView ? detailView.querySelector('.status-grid') : null;

    if (memberList) originalMembers = memberList.innerHTML;
    if (progressArea) originalProgress = progressArea.innerHTML;
    if (statusGrid) originalStatus = statusGrid.innerHTML;

    function resetDetailView() {
        if (memberList) memberList.innerHTML = originalMembers;
        if (progressArea) progressArea.innerHTML = originalProgress;
        if (statusGrid) statusGrid.innerHTML = originalStatus;
    }

    function updateDetailView(userName, duration, goal) {
        if (memberList) {
            memberList.innerHTML = `
                <div class="member-item">
                    <div class="member-avatar">
                        <img src="img/Profile.png" alt="Profile">
                    </div>
                    <span class="member-name">${userName}</span>
                </div>
            `;
        }
        if (progressArea) {
             progressArea.innerHTML = `
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
        if (statusGrid) {
            statusGrid.innerHTML = `
                <div class="status-item">
                    <div class="status-user">
                        <div class="status-avatar">
                            <img src="img/Profile.png" alt="Profile">
                        </div>
                        <span>${userName}</span>
                    </div>
                    <span class="status-label danger">미제출</span>
                </div>
            `;
        }
        const goalBox = detailView.querySelector('.goal-box');
        if (goalBox) goalBox.textContent = goal;
    }

    
    let currentDetailCard = null;
    let currentDetailChallengeData = null;

    if (detailButtons.length > 0 && detailView) {
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                resetDetailView();

                
                const parentModal = btn.closest('.popup-modal') || btn.closest('.modal');
                if (parentModal) {
                    lastActiveModal = parentModal;
                    parentModal.classList.add('hidden');
                } else {
                    // Try to guess based on visibility
                    if (challengeModal && !challengeModal.classList.contains('hidden')) {
                         lastActiveModal = challengeModal;
                         challengeModal.classList.add('hidden');
                    } else if (ongoingModal && !ongoingModal.classList.contains('hidden')) {
                         lastActiveModal = ongoingModal;
                         ongoingModal.classList.add('hidden');
                    } else {
                        // Fallback
                        if (challengeModal) challengeModal.classList.add('hidden');
                        if (ongoingModal) ongoingModal.classList.add('hidden');
                    }
                }

                
                const card = btn.closest('.challenge-card');
                currentDetailCard = card; 
                currentDetailChallengeData = null; 

                if (card) {
                    const infos = card.querySelectorAll('.card-info p');
                    let goalText = '';
                    infos.forEach(p => {
                        if (p.textContent.includes('목표 -')) {
                            goalText = p.textContent.split('목표 -')[1].trim();
                        }
                    });
                    
                    const goalBox = detailView.querySelector('.goal-box');
                    if (goalBox && goalText) {
                        goalBox.textContent = goalText;
                    }
                }

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
                saveChallenges();
                
                
                updateCardDOM(currentEditingCard, currentEditingChallenge.name, currentEditingChallenge.duration, currentEditingChallenge.goal, currentEditingChallenge.createdAt);
            } else {
                
                updateCardDOM(currentEditingCard, newName, newDuration, newGoal, new Date());
            }
            
            editChallengeModal.classList.add('hidden');
            showAlert('수정이 완료되었습니다.');
        });
    }

    function updateCardDOM(card, name, duration, goal, startDate) {
         if (!card) return;
         
         
         const title = card.querySelector('.card-top h3');
         if (title) title.textContent = name;

         
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
        const { name, duration, goal, userName, createdAt } = challengeData;

        
        
        const today = createdAt ? new Date(createdAt) : new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + duration);
        
        const formatDate = (date) => {
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
        };
        
        const dateString = `${formatDate(today)} ~ ${formatDate(endDate)}`;

        
        const newCard = document.createElement('div');
        newCard.classList.add('challenge-card');
        newCard.innerHTML = `
        <div class="card-top">
            <h3>${name}</h3>
            <span class="status">(진행 중)</span>
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

            updateDetailView(userName, duration, goal);

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
             const goalInput = document.getElementById('new-challenge-goal');
             const codeInput = document.getElementById('new-challenge-code');
             
             const name = nameInput.value;
             const duration = parseInt(durationInput.value) || 0;
             const goal = goalInput.value;
             const userName = userInput.value;
             // Code is optional
             const code = codeInput ? codeInput.value.trim() : '';

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
            
            
            updateDetailView(challenge.userName, challenge.duration, challenge.goal);
            
            
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
        });

        const overlay = challengeOverModal.querySelector('.popup-overlay');
        const closeX = challengeOverModal.querySelector('.close-challenge-over-x');
        const closeWrapper = challengeOverModal.querySelector('.close-btn-wrapper');

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
