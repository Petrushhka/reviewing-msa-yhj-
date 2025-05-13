import { useContext } from 'react';
import { Modal, Box, Typography, LinearProgress } from '@mui/material';
import AuthContext from '../context/UserContext'; // 경로는 실제 프로젝트 구조에 맞게 수정

/**
 * 뱃지 진행 상황을 보여주는 모달 컴포넌트
 * @param open - 모달 열림 여부
 * @param onClose - 모달 닫기 함수
 * @param progress - 서버에서 받은 진행 상황 정보
 */
const BadgeProgressModal = ({ open, onClose, progress }) => {
  const { badge } = useContext(AuthContext); // ✅ Context에서 badge 사용

  // 진행률 계산 함수
  const calculatePercent = (progress) => {
    if (!progress || progress.nextLevel === 'MAX') return 100;
    return Math.floor(
      (progress.currentPoint /
        (progress.currentPoint + progress.pointsToNextLevel)) *
        100,
    );
  };

  // 조건: 아직 progress가 없을 경우
  if (!progress) {
    return (
      <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 300,
          }}
        >
          <Typography>로딩 중...</Typography>
        </Box>
      </Modal>
    );
  }

  const percent = calculatePercent(progress);

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 300,
        }}
      >
        {badge?.level === 'ADMIN' ? (
          <Typography align='center'>내가 운영자요</Typography>
        ) : (
          <>
            <Typography>현재 포인트: {progress.currentPoint}점</Typography>
            <Typography>현재 티어: {progress.currentLevel}</Typography>

            {progress.nextLevel === 'MAX' ? (
              <Typography>최고 레벨입니다</Typography>
            ) : (
              <>
                <Typography>다음 티어: {progress.nextLevel}</Typography>
                <Typography>
                  남은 포인트: {progress.pointsToNextLevel}점
                </Typography>
              </>
            )}

            <Box sx={{ mt: 2 }}>
              <LinearProgress variant='determinate' value={percent} />
              <Typography align='right' variant='caption' sx={{ mt: 1 }}>
                {percent}%
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default BadgeProgressModal;
