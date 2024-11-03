const buttons = [
            { div: document.getElementById('div1'), button: document.getElementById('button1'), posX: 0, posY: 0, dirX: 1, dirY: 1 },
            { div: document.getElementById('div2'), button: document.getElementById('button2'), posX: 0, posY: 0, dirX: -1, dirY: 1 },
            { div: document.getElementById('div3'), button: document.getElementById('button3'), posX: 0, posY: -1, dirX: 1, dirY: -1 }
        ];
        const timerDisplay = document.getElementById('timer');
        const siren = document.getElementById('siren');
        const moveSpeed = 8;
        let timer = 20;
        let timerInterval;
        let clickCooldown = false;
        let buttonClicked = false;

        const mockingMessages = [
            "Too slow! 😂",
            "Try again, speedster! 😜",
            "Missed it, better luck next time! 🙈"
        ];

        function moveDivs() {
            buttons.forEach(buttonObj => {
                buttonObj.posX += buttonObj.dirX * moveSpeed;
                buttonObj.posY += buttonObj.dirY * moveSpeed;

                if (buttonObj.posX <= 0 || buttonObj.posX + buttonObj.div.offsetWidth >= window.innerWidth) {
                    buttonObj.dirX *= -1;
                }
                if (buttonObj.posY <= 0 || buttonObj.posY + buttonObj.div.offsetHeight >= window.innerHeight) {
                    buttonObj.dirY *= -1;
                }

                buttonObj.div.style.transform = `translate(${buttonObj.posX}px, ${buttonObj.posY}px)`;
            });

            requestAnimationFrame(moveDivs);
        }

        function updateTimerDisplay() {
            timerDisplay.textContent = timer.toString(2).padStart(5, '0'); // Convert to binary with 5 digits
        }

        function startTimer() {
            updateTimerDisplay(); // Initial display in binary
            timerInterval = setInterval(() => {
                timer--;
                updateTimerDisplay();
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    siren.play();
                }
            }, 1000);
        }

        function showMockingDialogue(message, button) {
            const dialogue = document.createElement('div');
            dialogue.className = 'mocking-dialogue';
            dialogue.textContent = message;

            const buttonRect = button.getBoundingClientRect();
            const offsetX = (Math.random() * 200) - 100;
            const offsetY = (Math.random() * 200) - 100;
            dialogue.style.left = `${buttonRect.left + offsetX}px`;
            dialogue.style.top = `${buttonRect.top + offsetY}px`;

            document.body.appendChild(dialogue);

            setTimeout(() => {
                dialogue.style.opacity = '0';
                setTimeout(() => {
                    dialogue.remove();
                }, 500);
            }, 2000);
        }

        buttons.forEach(buttonObj => {
            buttonObj.button.addEventListener('click', () => {
                if (clickCooldown) {
                    siren.play();
                    return;
                }

                if (buttonObj.button.id === 'button1') {
    // Correct button clicked
    buttonClicked = true;
    clearInterval(timerInterval);
    siren.pause();
    siren.currentTime = 0;
    alert(`Button 1 clicked! Timer stopped.`);
    
    // Get the current URL and navigate to the new path
    const currentUrl = window.location.href;
    window.location.href = currentUrl + 'piano'; // Ensure there's no double slash
} else {
    // Wrong button clicked
    timer -= 5;
    updateTimerDisplay();
    alert('Wrong button! Time reduced by 5 seconds.');
}


                clickCooldown = true;
                setTimeout(() => {
                    clickCooldown = false;
                }, 1000);
            });
        });

        document.addEventListener('click', (event) => {
            buttons.forEach(buttonObj => {
                const buttonRect = buttonObj.button.getBoundingClientRect();
                const clickedInside = (
                    event.clientX >= buttonRect.left &&
                    event.clientX <= buttonRect.right &&
                    event.clientY >= buttonRect.top &&
                    event.clientY <= buttonRect.bottom
                );

                if (!clickedInside && !clickCooldown && !buttonClicked) {
                    const randomMessage = mockingMessages[Math.floor(Math.random() * mockingMessages.length)];
                    showMockingDialogue(randomMessage, buttonObj.button);
                }
            });
        });

        moveDivs();
        startTimer();