import { Close as CloseIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  Dialog,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';

import { constants } from '../../constants';

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

export const PrivacyPolicyDialog = (props: PrivacyPolicyDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = useCallback(() => props.closeAction && props.closeAction(), [props]);

  useEffect(() => {
    if (props.open) {
      // ダイアログを開く際にスクロール位置を先頭に戻す
      const element = dialogRef.current?.getElementsByClassName('MuiDialog-paperScrollPaper')[0] as Element;
      if (element) element.scrollTop = 0;
      if (process.env.NODE_ENV !== 'production') console.debug('useEffect called.');
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
      fullWidth={!isXs}
      fullScreen={isXs}
      sx={isXs ? { maxHeight: '85vh', mt: '15vh' } : null}
    >
      <AppBar sx={{ position: 'sticky' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              sx={{ display: 'flex', p: 1 }}
              variant="h6"
              component="div"
              data-testid="privacyPolicyDialog__title"
            >
              プライバシーポリシー
            </Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }} />
            <IconButton sx={{ display: 'flex' }} onClick={handleClose} data-testid="privacyPolicyDialog__closeButton">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ pb: 10 }} data-testid="privacyPolicyDialog__body">
        <Box sx={{ my: 5 }}>
          <Typography variant="subtitle1">
            {constants.meta.title}
            （以下「当サイト」）の個人情報の取得、利用について、以下の通り個人情報保護方針（プライバシーポリシー）を定義し、厳正に管理いたします。
          </Typography>
        </Box>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            個人情報の取得
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            当サイトでは、下記の場合に個人情報を取得します。
            <List sx={{ pb: 0 }}>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="- お問い合わせを送信された場合" />
              </ListItem>
            </List>
          </Typography>
        </Box>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            個人情報の利用目的
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            当サイトでは、取得した個人情報を以下の目的で利用いたします。
            <List sx={{ pb: 0 }}>
              <ListItem sx={{ py: 0 }}>
                <ListItemText primary="- お問い合わせへの対応のため" />
              </ListItem>
            </List>
          </Typography>
        </Box>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            個人情報の第三者提供
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            法令に基づく場合等正当な理由に拠らない限り、事前に本人の同意を得ることなく、個人情報を第三者に開示、提供することはありません。
          </Typography>
        </Box>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            アクセス解析ツールについて
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            当サイトでは、サービス向上のため Google アナリティクス を利用し、アクセス情報の解析を行います。
            <br />
            Google アナリティクス はアクセス情報を収集するために Cookie
            を使用します。情報は匿名で収集されており、個人を特定するものではありません。
            <br />
            この機能は、お使いのブラウザの設定で Cookie を無効にすることで拒否できます。
            <br />
            <br />
            規約の詳細は{'\u00A0'}
            <Link
              href="https://marketingplatform.google.com/about/analytics/terms/jp/"
              target="_blank"
              color="inherit"
              underline="always"
            >
              Google アナリティクス利用規約
            </Link>
            {'\u00A0'}をご確認ください。
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            免責事項
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            当サイトの掲載内容によって生じた損害に対する一切の責任を負わないものとします。
            <br />
            リンク先の他サイトで提供される情報、サービスについても、その責任を負いかねます。
          </Typography>
        </Box>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            著作権
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            当サイトに掲載される文章、画像、その他のコンテンツは著作権により保護されています。
            <br />
            法的に認められた範囲を超えての引用、無断での使用や転載を禁止します。
          </Typography>
        </Box>
      </Container>
    </Dialog>
  );
};
