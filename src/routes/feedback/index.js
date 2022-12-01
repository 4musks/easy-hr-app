import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "components/Button";
import Spinner from "components/Spinner";
import AddFeedbackDialog from "components/AddFeedbackDialog";
import { useMergeState } from "utils/custom-hooks";
import {
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../api";

export default function FeedbackContainer(props) {
  const { user } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    feedback: [],
    shouldShowAddFeedbackDialog: false,
    shouldEdit: false,
    selectedFeedback: {},
    isLoading: false,
  });

  const handleOpenAddFeedbackDialog = (
    shouldEdit = false,
    selectedFeedback = {}
  ) => {
    setState({
      shouldShowAddFeedbackDialog: true,
      shouldEdit,
      selectedFeedback,
    });
  };

  const handleCloseAddFeedbackDialog = () => {
    setState({
      shouldShowAddFeedbackDialog: false,
      shouldEdit: false,
      selectedFeedback: {},
    });
  };

  const init = async () => {
    setState({ isLoading: true });

    const response = await getFeedback();

    if (response?.success) {
      setState({
        feedback: response?.data,
      });
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
  };

  const handleAddFeedback = async (payload) => {
    let response = null;

    if (state?.shouldEdit) {
      response = await updateFeedback(payload);
    } else {
      response = await createFeedback(payload);
    }

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
      handleCloseAddFeedbackDialog();
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteFeedback({ id });

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
              <div className="text-3xl font-semibold text-grey">Feedback</div>
              <div>
                <Button
                  label="Add Feedback"
                  color="secondary"
                  onClick={() => handleOpenAddFeedbackDialog(false)}
                  style={{
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#FFFFFF",
                    height: 40,
                  }}
                />
              </div>
            </div>

            {!state?.feedback?.length && (
              <div className="flex flex-col justify-center items-center mt-20">
                <div className="text-grey text-xl">
                  Start by sharing a feedback
                </div>
              </div>
            )}

            <div className="mt-10">
              {state?.feedback?.map((elem) => (
                <div
                  key={elem?._id}
                  className="p-4 flex justify-between items-center mt-4 card"
                >
                  <div>
                    <div className="text-sm">
                      <b className="member">
                        {elem?.isAnonymous ? "Someone" : elem?.user?.firstName}
                      </b>{" "}
                      shared a feedback
                    </div>

                    <div className="text-xs mt-2">{elem?.description}</div>
                  </div>

                  {user?._id === elem?.user?._id && (
                    <div>
                      <IconButton
                        onClick={() => handleOpenAddFeedbackDialog(true, elem)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDelete(elem?._id)}
                        sx={{ marginLeft: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.shouldShowAddFeedbackDialog && (
        <AddFeedbackDialog
          open={state?.shouldShowAddFeedbackDialog}
          shouldEdit={state?.shouldEdit}
          selectedFeedback={state?.selectedFeedback}
          onClose={handleCloseAddFeedbackDialog}
          onSave={handleAddFeedback}
        />
      )}
    </div>
  );
}
