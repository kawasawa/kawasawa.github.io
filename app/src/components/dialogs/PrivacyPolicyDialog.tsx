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
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { meta } from '@/constants';
import { isTest } from '@/utils/env';

export type PrivacyPolicyDialogProps = {
  open: boolean;
  closeAction: { (): void };
};

const Transition = React.forwardRef(function _(
  props: SlideProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide ref={ref} direction="up" {...props} />;
});

const titleKeys = ['acquisition', 'purpose', 'thirdParty', 'analysis', 'disclaimer', 'copyright'];

export const PrivacyPolicyDialog = (props: PrivacyPolicyDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const ltSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [t] = useTranslation();

  const handleClose = useCallback(() => props.closeAction && props.closeAction(), [props]);

  useEffect(() => {
    if (props.open) {
      // ダイアログを開く際にスクロール位置を先頭に戻す
      const element = dialogRef.current?.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as Element;
      if (element) element.scrollTop = 0;
      /* istanbul ignore if */
      if (!isTest()) return;
      console.debug('ScrollTop Completed.');
    }
  }, [props.open]);

  return (
    <Dialog
      ref={dialogRef}
      open={props.open}
      TransitionComponent={Transition}
      onClose={handleClose}
      keepMounted
      maxWidth={false}
      fullWidth={!ltSm}
      fullScreen={ltSm}
      sx={ltSm ? { maxHeight: '85vh', mt: '15vh' } : null}
      style={{ whiteSpace: 'pre-wrap' }} // 空白と改行を反映させる
    >
      <AppBar sx={{ position: 'sticky' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              sx={{ display: 'flex', p: 1 }}
              variant="h6"
              component="div"
              data-testid="PrivacyPolicyDialog__Title"
            >
              {t('privacyPolicy')}
            </Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }} />
            <IconButton sx={{ display: 'flex' }} onClick={handleClose} data-testid="PrivacyPolicyDialog__Close">
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
};
