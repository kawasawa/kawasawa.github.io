import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  GrowProps,
} from '@mui/material';
import React from 'react';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  affirmativeText?: string;
  negativeText?: string;
  affirmativeAction: { (): void };
  negativeAction: { (): void };
  bottomContent?: React.ReactNode;
  danger?: boolean;
};

const Transition = React.forwardRef(function _(props: GrowProps & { children: React.ReactElement }, ref) {
  return <Grow ref={ref} timeout={500} {...props} />;
});

export const ConfirmDialog = React.memo(function _(props: ConfirmDialogProps) {
  const handleAffirmative = React.useCallback(() => props.affirmativeAction && props.affirmativeAction(), [props]);
  const handleNegative = React.useCallback(() => props.negativeAction && props.negativeAction(), [props]);

  return (
    <Dialog open={props.open} TransitionComponent={Transition} onClose={handleNegative} keepMounted>
      <DialogTitle data-testid="ConfirmDialog__Title">{props.title}</DialogTitle>
      <DialogContent data-testid="ConfirmDialog__Message">
        <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={handleNegative} data-testid="ConfirmDialog__Cancel">
          {props.negativeText ?? 'Cancel'}
        </Button>
        <Button
          color={props.danger ? 'error' : 'info'}
          variant="contained"
          onClick={handleAffirmative}
          autoFocus
          data-testid="ConfirmDialog__OK"
        >
          {props.affirmativeText ?? 'OK'}
        </Button>
      </DialogActions>
      {props.bottomContent}
    </Dialog>
  );
});
