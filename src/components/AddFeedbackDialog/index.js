import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import { Dialog, DialogTitle } from "components/Dialog";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";

export default function AddFeedbackDialog(props) {
  const { open, shouldEdit, selectedFeedback, onClose, onSave } = props;

  const [state, setState] = useMergeState({
    description: "",
    isAnonymous: false,
    errors: {},
  });

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleIsAnonymous = (event) => {
    setState({ isAnonymous: event?.target?.checked });
  };

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.description) {
      payload = { description: true };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSave = () => {
    if (!isFormValid()) {
      return;
    }

    const payload = { ...state };

    if (shouldEdit) {
      payload.id = selectedFeedback?._id;
    }

    delete payload.errors;

    onSave(payload);
  };

  useEffect(() => {
    if (shouldEdit) {
      setState({
        description: selectedFeedback?.description,
        isAnonymous: selectedFeedback?.isAnonymous,
      });
    }
  }, []);

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(event);
        }
      }}
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle onClose={onClose}>
        <span className="text-xl font-semibold">Add Feedback</span>
      </DialogTitle>

      <DialogContent dividers>
        <div className="my-4">
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            name="description"
            value={state.description}
            onChange={handleChange}
            required
            error={state?.errors?.description}
            multiline
            minRows={5}
          />

          {state?.errors?.description && (
            <ErrorMessage message="Description is required" />
          )}
        </div>

        <div className="my-4">
          <Checkbox checked={state?.isAnonymous} onChange={handleIsAnonymous} />
          Share feedback anonymously?
        </div>
      </DialogContent>

      <DialogActions>
        <Button label="Save" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
}
