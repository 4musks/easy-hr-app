import React, { useEffect } from "react";
import moment from "moment-timezone";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Dialog, DialogTitle } from "components/Dialog";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";

export default function AddWorklogDialog(props) {
  const { open, shouldEdit, selectedWorklog, onClose, onSave } = props;

  const [state, setState] = useMergeState({
    serviceDate: moment(),
    hours: 0,
    notes: "",
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

    if (!state.serviceDate) {
      payload = { serviceDate: true, ...payload };
      isValid = false;
    }

    if (!state.hours) {
      payload = { hours: true, ...payload };
      isValid = false;
    }

    if (!state.notes) {
      payload = { notes: true, ...payload };
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
      payload.id = selectedWorklog?._id;
    }

    delete payload.errors;

    onSave(payload);
  };

  useEffect(() => {
    if (shouldEdit) {
      setState({
        serviceDate: selectedWorklog?.serviceDate,
        hours: selectedWorklog?.hours,
        notes: selectedWorklog?.notes,
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
        <span className="text-xl font-semibold">Add Worklog</span>
      </DialogTitle>

      <DialogContent dividers>
        <div className="mt-2">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              label="Service Date"
              inputFormat="MM/DD/YYYY"
              value={state?.serviceDate}
              onChange={(newValue) => {
                setState({ serviceDate: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={state?.errors?.serviceDate}
                />
              )}
            />
          </LocalizationProvider>

          {state?.errors?.serviceDate && (
            <ErrorMessage message="Service Date is required" />
          )}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Hours"
            variant="outlined"
            name="hours"
            type="number"
            value={state.hours}
            onChange={handleChange}
            required
            error={state?.errors?.hours}
          />

          {state?.errors?.hours && <ErrorMessage message="Hours is required" />}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Notes"
            variant="outlined"
            name="notes"
            value={state.notes}
            onChange={handleChange}
            multiline
            minRows={5}
            required
            error={state?.errors?.notes}
          />

          {state?.errors?.notes && <ErrorMessage message="Notes is required" />}
        </div>
      </DialogContent>

      <DialogActions>
        <Button label="Save" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
}
