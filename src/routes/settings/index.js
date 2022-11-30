import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import Button from "components/Button";
import Spinner from "components/Spinner";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";
import { USER_ROLES } from "utils/constants";
import { getUserInfo, getUsers, updateProfile } from "../../api";

export default function SettingsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
    hourlyRate: "",
    role: "",
    manager: "",
    users: [],
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

  const handleSave = async () => {
    const payload = { ...state };

    delete payload.isLoading;
    delete payload.errors;
    delete payload.users;

    setState({ isLoading: true });

    const response = await updateProfile(payload);

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
  };

  const isDisabled = state?.role !== USER_ROLES.ADMIN;

  useEffect(() => {
    const init = async () => {
      setState({ isLoading: true });

      const userResponse = await getUserInfo();

      if (userResponse?.success) {
        const payload = {
          firstName: userResponse?.data?.firstName,
          lastName: userResponse?.data?.lastName,
          dob: userResponse?.data?.dob,
          email: userResponse?.data?.email,
          department: userResponse?.data?.department,
          designation: userResponse?.data?.designation,
          joiningDate: userResponse?.data?.joiningDate,
          hourlyRate: userResponse?.data?.hourlyRate,
          role: userResponse?.data?.role,
        };

        if (userResponse?.data?.role === USER_ROLES.EMPLOYEE) {
          payload.manager = userResponse?.data?.manager;

          const response = await getUsers({ all: true });

          if (response?.success) {
            payload.users = response?.data;
          }
        }

        setState(payload);
      }

      setState({ isLoading: false });
    };

    init();
  }, []);

  return (
    <div>
      <div>
        {state?.isLoading ? (
          <div className="mt-10 w-full h-screen flex justify-center">
            <Spinner loading={state?.isLoading} />
          </div>
        ) : (
          <div>
            <div className="text-3xl font-semibold text-grey mb-10">
              Profile
            </div>

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

            <div className="my-4 flex">
              <div className="w-1/2">
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                  required
                  error={state?.errors?.email}
                  disabled={isDisabled}
                />

                {state?.errors?.email && (
                  <ErrorMessage message="Email is required" />
                )}
              </div>

              <div className="w-1/2 ml-1">
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
            </div>

            <div className="my-4 flex">
              <div className="w-1/2">
                <TextField
                  fullWidth
                  label="Department"
                  variant="outlined"
                  name="department"
                  value={state.department}
                  onChange={handleChange}
                  required
                  error={state?.errors?.department}
                  disabled={isDisabled}
                />

                {state?.errors?.department && (
                  <ErrorMessage message="Department is required" />
                )}
              </div>

              <div className="w-1/2 ml-1">
                <TextField
                  fullWidth
                  label="Designation"
                  variant="outlined"
                  name="designation"
                  value={state.designation}
                  onChange={handleChange}
                  required
                  error={state?.errors?.designation}
                  disabled={isDisabled}
                />

                {state?.errors?.designation && (
                  <ErrorMessage message="Designation is required" />
                )}
              </div>
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
                    disabled={isDisabled}
                  />
                </LocalizationProvider>

                {state?.errors?.joiningDate && (
                  <ErrorMessage message="joining Date is required" />
                )}
              </div>

              <div className="w-1/2 ml-1">
                <TextField
                  fullWidth
                  label="Hourly Rate"
                  variant="outlined"
                  name="hourlyRate"
                  value={state.hourlyRate}
                  onChange={handleChange}
                  required
                  error={state?.errors?.hourlyRate}
                  disabled={isDisabled}
                />

                {state?.errors?.hourlyRate && (
                  <ErrorMessage message="Hourly Rate is required" />
                )}
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2">
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    name="role"
                    value={state?.role}
                    onChange={handleChange}
                    autoComplete="off"
                    inputProps={{
                      autoComplete: "new-password",
                    }}
                    displayEmpty
                    fullWidth
                    disabled={isDisabled}
                  >
                    <MenuItem value="" disabled>
                      Select an option...
                    </MenuItem>
                    {Object.values(USER_ROLES).map((item, index) => (
                      <MenuItem key={`${item}#${index}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {state?.role === USER_ROLES.EMPLOYEE && (
                <div className="w-1/2 ml-1">
                  <FormControl fullWidth>
                    <InputLabel>Manager</InputLabel>
                    <Select
                      label="Manager"
                      name="manager"
                      value={state?.manager}
                      onChange={handleChange}
                      autoComplete="off"
                      inputProps={{
                        autoComplete: "new-password",
                      }}
                      displayEmpty
                      fullWidth
                      disabled={isDisabled}
                    >
                      <MenuItem value="" disabled>
                        Select an option...
                      </MenuItem>
                      {state?.users?.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.firstName} {item.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Button
                label="Save"
                color="secondary"
                onClick={handleSave}
                style={{
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#FFFFFF",
                  height: 40,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
