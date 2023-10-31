import { Close as CloseIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  Dialog,
  IconButton,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { meta } from '@/constants';

export type PrivacyPolicyDialogProps = {
  open: boolean;
  closeAction: { (): void };
};

export type PrivacyPolicyDialogRef = {
  scrollTop: () => void;
};

const Transition = React.forwardRef(function _(props: SlideProps & { children: React.ReactElement }, ref) {
  return <Slide ref={ref} direction="up" {...props} />;
});

const titleKeys = ['acquisition', 'purpose', 'thirdParty', 'analysis', 'disclaimer', 'copyright'] as const;

export const PrivacyPolicyDialog = React.memo(function _(props: PrivacyPolicyDialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const ltSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [t] = useTranslation();

  const handleClose = React.useCallback(() => props.closeAction && props.closeAction(), [props]);

  const scrollTop = React.useCallback(() => {
    // ダイアログを開く際にスクロール位置を先頭に戻す
    const element = dialogRef.current?.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as Element;
    if (element) element.scrollTop = 0;
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'test') console.debug('ScrollTop Completed.');
  }, []);

  React.useEffect(() => {
    if (props.open) scrollTop();
  }, [props.open, scrollTop]);

  return (
    <Dialog
      ref={dialogRef}
      open={props.open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth={false}
      fullWidth={!ltSm}
      fullScreen={ltSm}
      sx={ltSm ? { maxHeight: '85vh', mt: '15vh' } : null} // モバイル端末時は Bottom Sheet 風の表示にする
      style={{ whiteSpace: 'pre-wrap' }} // 空白と改行を反映させる
    >
      <AppBar sx={{ position: 'sticky' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
            <Typography variant="h6" data-testid="PrivacyPolicyDialog__Title">
              {t('privacyPolicy')}
            </Typography>
            <IconButton onClick={handleClose} data-testid="PrivacyPolicyDialog__Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ pb: 10 }} data-testid="PrivacyPolicyDialog__Body">
        <Box sx={{ my: 5 }}>
          <Typography variant="subtitle1">{t('privacyPolicy__summary', { title: meta.title })}</Typography>
        </Box>
        {titleKeys.map((key) => (
          <Box key={`PrivacyPolicyDialog__Body--${key}`} sx={{ my: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t(`privacyPolicy__${key}__title`)}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
              {t(`privacyPolicy__${key}__body`)}
            </Typography>
          </Box>
        ))}
      </Container>
    </Dialog>
  );
});
