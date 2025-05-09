import { Modal, Box, Typography, LinearProgress } from '@mui/material';

/**
 * 뱃지 진행 상황을 보여주는 모달 컴포넌트
 * @param open - 모달 열림 여부
 * @param onClose - 모달 닫기 함수
 * @param progress - 서버에서 받은 진행 상황 정보
 */

const BadgeProgressModal = ({ open, onClose, progress }) => {
  console.log('모달 렌더링 상태:', open, progress);
  if (!progress) return null; // 데이터 없으면 렌더링 안함

  // 진행률 계산 (현재 포인트 / 다음 티어까지 필요한 총 포인트)
  const percent =
    progress.nextLevel !== 'MAX'
      ? Math.floor(
          (progress.currentPoint /
            (progress.currentPoint + progress.pointsToNextLevel)) *
            100,
        )
      : 100;

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Box
        sx={{
          position: 'absolute', // 🔥 모달을 화면 중앙에 띄우기 위해 꼭 필요
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
        <Typography variant='h6' gutterBottom>
          나의 티어 진행 상황
        </Typography>
        <Typography>현재 포인트: {progress.currentPoint}점</Typography>
        <Typography>현재 티어: {progress.currentLevel}</Typography>
        <Typography>다음 티어: {progress.nextLevel}</Typography>
        {progress.nextLevel !== 'MAX' && (
          <Typography>남은 포인트: {progress.pointsToNextLevel}점</Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant='determinate' value={percent} />
          <Typography align='right' variant='caption' sx={{ mt: 1 }}>
            {percent}%
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default BadgeProgressModal;
