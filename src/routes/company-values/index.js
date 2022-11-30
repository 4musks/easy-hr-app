import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "components/Button";
import Spinner from "components/Spinner";
import AddCompanyValueDialog from "components/AddCompanyValueDialog";
import { useMergeState } from "utils/custom-hooks";
import {
  getCompanyValues,
  addCompanyValue,
  updateCompanyValue,
  deleteCompanyValue,
} from "../../api";

export default function CompanyValuesContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    companyValues: [],
    shouldEdit: false,
    selectedCompanyValue: {},
    shouldShowAddCompanyValueDialog: false,
    isLoading: false,
  });

  const handleOpenAddCompanyValueDialog = (
    shouldEdit = false,
    selectedCompanyValue = {}
  ) => {
    setState({
      shouldShowAddCompanyValueDialog: true,
      shouldEdit,
      selectedCompanyValue,
    });
  };

  const handleCloseAddCompanyValueDialog = () => {
    setState({
      shouldShowAddCompanyValueDialog: false,
      shouldEdit: false,
      selectedCompanyValue: {},
    });
  };

  const init = async () => {
    setState({ isLoading: true });

    const response = await getCompanyValues();

    if (response?.success) {
      setState({
        companyValues: response?.data,
      });
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
  };

  const handleSaveCompanyValue = async (payload) => {
    let response = null;

    if (state?.shouldEdit) {
      response = await updateCompanyValue(payload);
    } else {
      response = await addCompanyValue(payload);
    }

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
      handleCloseAddCompanyValueDialog();
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteCompanyValue({ id });

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
      <div>
        {state?.isLoading ? (
          <div className="mt-10 w-full h-screen flex justify-center">
            <Spinner loading={state?.isLoading} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-semibold text-grey">
                Company Values
              </div>
              <div>
                <Button
                  label="Add Company Value"
                  color="secondary"
                  onClick={() => handleOpenAddCompanyValueDialog(false, {})}
                  style={{
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#FFFFFF",
                    height: 40,
                  }}
                />
              </div>
            </div>

            <div className="mt-10">
              {state?.companyValues?.map((elem) => (
                <div
                  key={elem?.title}
                  className="p-4 flex justify-between items-center mt-4 card"
                >
                  <div>
                    <div className="text-sm">
                      <b className="member">{elem?.title}</b>
                    </div>

                    <div className="text-xs mt-2">{elem?.description}</div>
                  </div>
                  <div>
                    <IconButton
                      onClick={() =>
                        handleOpenAddCompanyValueDialog(true, elem)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ marginLeft: 2 }}
                      onClick={() => handleDelete(elem?._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.shouldShowAddCompanyValueDialog && (
        <AddCompanyValueDialog
          open={state?.shouldShowAddCompanyValueDialog}
          shouldEdit={state?.shouldEdit}
          selectedCompanyValue={state?.selectedCompanyValue}
          onClose={handleCloseAddCompanyValueDialog}
          onSave={handleSaveCompanyValue}
        />
      )}
    </div>
  );
}
