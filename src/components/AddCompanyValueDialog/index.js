import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Dialog, DialogTitle } from "components/Dialog";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";

export default function AddCompanyValueDialog(props) {
  const {
    open,
    shouldEdit = false,
    selectedCompanyValue = {},
    onClose,
    onSave,
  } = props;

  const [state, setState] = useMergeState({
    title: "",
    description: "",
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

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.title) {
      payload = { title: true };
      isValid = false;
    }

    if (!state.description) {
      payload = { ...payload, description: true };
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
      payload.id = selectedCompanyValue._id;
    }

    delete payload.errors;

    onSave(payload);
  };

  useEffect(() => {
    if (shouldEdit) {
      setState({
        title: selectedCompanyValue?.title,
        description: selectedCompanyValue?.description,
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
        <span className="text-xl font-semibold">Add Company Value</span>
      </DialogTitle>

      <DialogContent dividers>
        <div className="my-4">
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            name="title"
            value={state.title}
            onChange={handleChange}
            required
            error={state?.errors?.title}
          />

          {state?.errors?.title && <ErrorMessage message="Title is required" />}
        </div>

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
      </DialogContent>

      <DialogActions>
        <Button label="Save" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
}
