import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default props => {
  const {
    dialogTitle,
    open,
    handleClose,
    handleConfirm,
    isDisabled,
    type,
    formId
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
        <DialogActions style={{ justifyContent: "space-evenly" }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="secondary"
            disabled={isDisabled}
            type={type}
            form={formId}
          >
            Confirm
          </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

