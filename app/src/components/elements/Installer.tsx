import { AddToHomeScreen as AddToHomeScreenIcon } from '@mui/icons-material';
import { Box, Button, Fab, Snackbar } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import usePwa from 'use-pwa';

import { SectionFadeIn } from '@/components/elements';

export const AUTO_HIDE_DURATION = 5000;

export const Installer = () => {
  const [t] = useTranslation();
  const pwa = usePwa();
  const [showAlternativeMessage, setShowAlternativeMessage] = React.useState(false);
  return (
    <>
      {!pwa.isPwa && (
        <Box sx={{ position: 'fixed', left: 24, bottom: 40, zIndex: 1, opacity: 0.75 }}>
          <SectionFadeIn in={true}>
            <Fab
              onClick={pwa.enabledPwa ? pwa.showInstallPrompt : () => setShowAlternativeMessage(true)}
              disabled={pwa.enabledPwa && !pwa.canInstallprompt}
              sx={{ width: 40, height: 40 }}
              data-testid="Installer__Fab"
            >
              <AddToHomeScreenIcon />
            </Fab>
          </SectionFadeIn>
        </Box>
      )}
      <Snackbar
        open={!!showAlternativeMessage}
        message={t('installer.alternative')}
        action={
          <Button onClick={() => setShowAlternativeMessage(false)} size="small">
            {t('installer.cancel')}
          </Button>
        }
        onClose={() => setShowAlternativeMessage(false)}
        autoHideDuration={AUTO_HIDE_DURATION}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        data-testid="Installer__Snackbar"
      />
    </>
  );
};
