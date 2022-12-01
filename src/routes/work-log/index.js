import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "components/Button";
import Spinner from "components/Spinner";
import AddWorklogDialog from "components/AddWorklogDialog";
import { useMergeState } from "utils/custom-hooks";
import { formatDate } from "utils/date";
import { getWorklog, createWorklog, updateWorklog, deleteWorklog } from "api";

export default function WorklogContainer(props) {
  const { user } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    worklog: [],
    shouldShowAddWorklogDialog: false,
    shouldEdit: false,
    selectedWorklog: {},
    isLoading: false,
  });

  const handleOpenAddWorklogDialog = (
    shouldEdit = false,
    selectedWorklog = {}
  ) => {
    setState({ shouldShowAddWorklogDialog: true, shouldEdit, selectedWorklog });
  };

  const handleCloseAddWorklogDialog = () => {
    setState({
      shouldShowAddWorklogDialog: false,
      shouldEdit: false,
      selectedWorklog: {},
    });
  };

  const init = async () => {
    setState({ isLoading: true });
    const response = await getWorklog();

    if (response?.success) {
      setState({
        worklog: response?.data,
      });
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
  };

  const handleAddWorklog = async (payload) => {
    let response = null;

    if (state?.shouldEdit) {
      response = await updateWorklog(payload);
    } else {
      response = await createWorklog(payload);
    }

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
      handleCloseAddWorklogDialog();
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteWorklog({ id });

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-semibold text-grey">Worklog</div>
            <div>
              <Button
                label="Add Worklog"
                color="secondary"
                onClick={() => handleOpenAddWorklogDialog(false)}
                style={{
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#FFFFFF",
                  height: 40,
                }}
              />
            </div>
          </div>

          <TableContainer className="mt-10">
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <span className="text-grey">Employee</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Service Date</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Hours</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Notes</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Actions</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.worklog?.map((elem) => (
                  <TableRow key={elem._id}>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {elem?.user?.firstName} {elem?.user?.lastName}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">
                        {formatDate(elem?.serviceDate, "ddd Do MMM YY")}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">{elem?.hours}</span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <span className="text-grey text-xs">{elem?.notes}</span>
                    </TableCell>

                    <TableCell component="th" scope="row" align="left">
                      {user?._id === elem?.user?._id && (
                        <div>
                          <IconButton
                            onClick={() =>
                              handleOpenAddWorklogDialog(true, elem)
                            }
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton onClick={() => handleDelete(elem?._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!state?.worklog.length && (
            <div className="flex justify-center mt-10">
              <div className="text-grey text-xl">Start by adding a Worklog</div>
            </div>
          )}
        </div>
      )}

      {state?.shouldShowAddWorklogDialog && (
        <AddWorklogDialog
          open={state?.shouldShowAddWorklogDialog}
          shouldEdit={state?.shouldEdit}
          selectedWorklog={state?.selectedWorklog}
          onClose={handleCloseAddWorklogDialog}
          onSave={handleAddWorklog}
        />
      )}
    </div>
  );
}
