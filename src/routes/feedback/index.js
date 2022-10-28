import React, { useEffect } from "react";
import Button from "components/Button";
import Spinner from "components/Spinner";
import AddFeedbackDialog from "components/AddFeedbackDialog";
import { useMergeState } from "utils/custom-hooks";

export default function FeedbackContainer() {
  const [state, setState] = useMergeState({
    feedback: [],
    shouldShowAddFeedbackDialog: false,
  });

  const handleOpenAddFeedbackDialog = () => {
    setState({ shouldShowAddFeedbackDialog: true });
  };

  const handleCloseAddFeedbackDialog = () => {
    setState({ shouldShowAddFeedbackDialog: false });
  };

  const handleAddFeedback = (payload) => {
    console.log("payload : ", payload);
    handleCloseAddFeedbackDialog();
  };

  useEffect(() => {
    setState({
      feedback: [
        {
          _id: "32132132",
          user: {
            firstName: "Nihal",
          },
          description: "Meetings have to be more shorter",
        },
      ],
    });
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
                  onClick={handleOpenAddFeedbackDialog}
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
                <span className="text-lg font-semibold">
                  No feedback available yet.
                </span>
              </div>
            )}

            <div className="mt-10">
              {state?.feedback?.map((elem) => (
                <div key={elem._id} className="p-4 flex items-center mt-4 card">
                  <div>
                    <div className="text-sm">
                      <b className="member">{elem.user.firstName}</b> shared a
                      feedback
                    </div>

                    <div className="text-xs mt-2">{elem.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.shouldShowAddFeedbackDialog && (
        <AddFeedbackDialog
          open={state?.shouldShowAddFeedbackDialog}
          onClose={handleCloseAddFeedbackDialog}
          onSave={handleAddFeedback}
        />
      )}
    </div>
  );
}
