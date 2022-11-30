import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { Dialog, DialogTitle } from "components/Dialog";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { getUsers, getCompanyValues } from "api";

export default function AddRecognitionDialog(props) {
  const { open, onClose, onSave } = props;

  const [state, setState] = useMergeState({
    toUser: "",
    companyValue: "",
    description: "",
    users: [],
    companyValues: [],
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

    if (!state.toUser) {
      payload = { toUser: true };
      isValid = false;
    }

    if (!state.companyValue) {
      payload = { ...payload, companyValue: true };
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

    delete payload.errors;
    delete payload.users;
    delete payload.companyValues;

    onSave(payload);
  };

  useEffect(() => {
    const init = async () => {
      const usersResponse = await getUsers({ all: true });

      if (usersResponse?.success) {
        setState({
          users: usersResponse?.data,
        });
      }

      const companyValuesResponse = await getCompanyValues();

      if (companyValuesResponse?.success) {
        setState({
          companyValues: companyValuesResponse?.data,
        });
      }
    };

    init();
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
        <span className="text-xl font-semibold">Give a Shoutout</span>
      </DialogTitle>

      <DialogContent dividers>
        <div className="my-4">
          <FormControl fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select
              label="Employee"
              name="toUser"
              value={state?.toUser}
              onChange={handleChange}
              autoComplete="off"
              inputProps={{
                autoComplete: "new-password",
              }}
              displayEmpty
              fullWidth
            >
              {state.users.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.firstName} {item.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="my-4">
          <FormControl fullWidth>
            <InputLabel>Company Values Favored</InputLabel>
            <Select
              label="Company Values Favored"
              name="companyValue"
              value={state?.companyValue}
              onChange={handleChange}
              autoComplete="off"
              inputProps={{
                autoComplete: "new-password",
              }}
              displayEmpty
              fullWidth
            >
              {state.companyValues.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
