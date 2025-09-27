**Project Set Up**


cd QUIZ-GAME_main
npm install

.env.local file:

(1) macOS:
touch .env.local
printf "ADMIN_USER=admin\nADMIN_PASS=123\n" > .env.local

(2) Windows

type NUL > .env.local
echo ADMIN_USER=admin> .env.local
echo ADMIN_PASS=123>> .env.local


npm run dev 
