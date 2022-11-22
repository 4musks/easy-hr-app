import React from "react";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Dialog, DialogTitle } from "components/Dialog";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import {inviteEmployee} from "../../api";

export default function InviteEmployeeDialog(props) {
  const { open, onClose, onSave } = props;

  const [state, setState] = useMergeState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
    annualIncome: "",
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

    if (!state.firstName) {
      payload = { firstName: true, ...payload };
      isValid = false;
    }

    if (!state.lastName) {
      payload = { lastName: true, ...payload };
      isValid = false;
    }

    if (!state.dob) {
      payload = { dob: true, ...payload };
      isValid = false;
    }

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.department) {
      payload = { department: true, ...payload };
      isValid = false;
    }

    if (!state.designation) {
      payload = { designation: true, ...payload };
      isValid = false;
    }

    if (!state.joiningDate) {
      payload = { joiningDate: true, ...payload };
      isValid = false;
    }

    if (!state.annualIncome) {
      payload = { annualIncome: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSave =  () => {
    if (!isFormValid()) {
      return;
    }

    const payload = {...state};
    delete payload.errors;

    onSave(payload);
  };

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
        <span className="text-xl font-semibold">Invite Employee</span>
      </DialogTitle>

      <DialogContent dividers>
        <div className="my-4 flex">
          <div className="w-1/2">
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="firstName"
              value={state.firstName}
              onChange={handleChange}
              required
              error={state?.errors?.firstName}
            />

            {state?.errors?.firstName && (
              <ErrorMessage message="First Name is required" />
            )}
          </div>

          <div className="w-1/2 ml-1">
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
              required
              error={state?.errors?.lastName}
            />

            {state?.errors?.lastName && (
              <ErrorMessage message="Last Name is required" />
            )}
          </div>
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={state.email}
            onChange={handleChange}
            required
            error={state?.errors?.email}
          />

          {state?.errors?.email && <ErrorMessage message="Email is required" />}
        </div>

        <div className="my-4 flex">
          <div className="w-1/2">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Date of Birth"
                value={state?.dob}
                onChange={(newValue) => {
                  setState({ dob: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={state?.errors?.dob}
                  />
                )}
              />
            </LocalizationProvider>

            {state?.errors?.dob && (
              <ErrorMessage message="Date of Birth is required" />
            )}
          </div>

          <div className="w-1/2 ml-1">
            <TextField
              fullWidth
              label="Department"
              variant="outlined"
              name="department"
              value={state.department}
              onChange={handleChange}
              required
              error={state?.errors?.department}
            />

            {state?.errors?.department && (
              <ErrorMessage message="Department is required" />
            )}
          </div>
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Designation"
            variant="outlined"
            name="designation"
            value={state.designation}
            onChange={handleChange}
            required
            error={state?.errors?.designation}
          />

          {state?.errors?.designation && (
            <ErrorMessage message="Designation is required" />
          )}
        </div>

        <div className="my-4 flex">
          <div className="w-1/2">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Joining Date"
                value={state?.joiningDate}
                onChange={(newValue) => {
                  setState({ joiningDate: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={state?.errors?.joiningDate}
                  />
                )}
              />
            </LocalizationProvider>

            {state?.errors?.joiningDate && (
              <ErrorMessage message="joining Date is required" />
            )}
          </div>

          <div className="w-1/2 ml-1">
            <TextField
              fullWidth
              label="Annual Income"
              variant="outlined"
              name="annualIncome"
              value={state.annualIncome}
              onChange={handleChange}
              required
              error={state?.errors?.annualIncome}
            />

            {state?.errors?.annualIncome && (
              <ErrorMessage message="Annual Income is required" />
            )}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button label="Send Invitation" onClick={handleSave} />
      </DialogActions>
    </Dialog>
  );
}
