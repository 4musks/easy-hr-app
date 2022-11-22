import React, { useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "components/Button";
import Spinner from "components/Spinner";
import InviteEmployeeDialog from "components/InviteEmployeeDialog";
import { useMergeState } from "utils/custom-hooks";
import { formatDate } from "utils/date";
import {getSelfEmployeeDetails, inviteEmployee} from "../../api";

export default function EmployeesContainer() {
  const [state, setState] = useMergeState({
    employees: [],
    shouldShowInviteEmployeeDialog: false,
    isLoading: false,
  });

  const handleOpenInviteEmployeeDialog = () => {
    setState({ shouldShowInviteEmployeeDialog: true });
  };

  const handleCloseInviteEmployeeDialog =  () => {
    setState({shouldShowInviteEmployeeDialog: false});
  };

  const handleInviteEmployee = async (payload) => {
    // adding employee to table
    await inviteEmployee(payload)

    // getting updated list of all employees
    const employeeDetails = await getSelfEmployeeDetails();

    // updating state with employees
    setState({employees: employeeDetails.data.employees});
    console.log("payload : ", payload);
    handleCloseInviteEmployeeDialog();
  };

  // get latest list of employees on first load
  useEffect(async () => {
    const employeeDetails = await getSelfEmployeeDetails();
     setState({employees:employeeDetails.data.employees});
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
            <div className="text-3xl font-semibold text-grey">Employees</div>
            <div>
              <Button
                label="Invite Employee"
                color="secondary"
                onClick={handleOpenInviteEmployeeDialog}
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
                    <span className="text-grey">Name</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">DOB</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Email</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Department</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Designation</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Joining Date</span>
                  </TableCell>
                  <TableCell align="left">
                    <span className="text-grey">Annual Income</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.employees?.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {employee?.firstName} {employee?.lastName}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {formatDate(employee?.dob, "MM/DD/YYYY")}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {employee?.email}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {employee?.department}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {employee?.designation}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {employee?.joiningDate}
                      </span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        ${employee?.annualIncome}
                      </span>
                    </TableCell>
                    {/* <TableCell component="th" scope="row" align="left">
            <span className="text-grey text-xs underline cursor-pointer">
              contact/edit
            </span>
          </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!state?.employees.length && (
            <div className="flex justify-center mt-10">
              <div className="text-grey text-xl">
                Start by inviting an Employee
              </div>
            </div>
          )}
        </div>
      )}

      {state?.shouldShowInviteEmployeeDialog && (
        <InviteEmployeeDialog
          open={state?.shouldShowInviteEmployeeDialog}
          onClose={handleCloseInviteEmployeeDialog}
          onSave={handleInviteEmployee}
        />
      )}
    </div>
  );
}
