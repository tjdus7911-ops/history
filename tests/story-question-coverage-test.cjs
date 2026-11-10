// 원삼국 스토리 연결 기출의 학습 범위 데이터가 최신이고, 정답 개념은 모두 문제가 나오기 전에 배우는지 확인한다.
const {execFileSync}=require('node:child_process');
process.stdout.write(execFileSync('node',['scripts/build-story-question-coverage.cjs','--check'],{encoding:'utf8'}));
