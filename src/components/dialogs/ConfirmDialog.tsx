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
import React, { useCallback } from 'react';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  affirmativeText?: string;
  negativeText?: string;
  affirmativeAction: { (): void };
  negativeAction: { (): void };
  bottomContent?: React.ReactNode;
};

const Transition = React.forwardRef(function _(
  props: GrowProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} timeout={500} {...props} />;
});

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const handleAffirmative = useCallback(() => props.affirmativeAction && props.affirmativeAction(), [props]);
  const handleNegative = useCallback(() => props.negativeAction && props.negativeAction(), [props]);

  return (
    <Dialog open={props.open} TransitionComponent={Transition} onClose={handleNegative} keepMounted>
      <DialogTitle data-testid="confirmDialog__title">{props.title}</DialogTitle>
      <DialogContent data-testid="confirmDialog__message">
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={handleNegative} data-testid="confirmDialog__cancelButton">
          {props.negativeText ?? 'Cancel'}
        </Button>
        <Button
          color="info"
          variant="contained"
          onClick={handleAffirmative}
          autoFocus
          data-testid="confirmDialog__okButton"
        >
          {props.affirmativeText ?? 'OK'}
        </Button>
      </DialogActions>
      {props.bottomContent}
    </Dialog>
  );
};
