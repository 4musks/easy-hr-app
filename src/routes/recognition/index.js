import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { TwitterShareButton } from "react-twitter-embed";
import Button from "components/Button";
import Spinner from "components/Spinner";
import AddRecognitionDialog from "components/AddRecognitionDialog";
import { useMergeState } from "utils/custom-hooks";
import { getRecognition, addRecognition, deleteRecognition } from "../../api";

export default function RewardsAndRecognitionContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    recognition: [],
    shouldShowAddRecognitionDialog: false,
    isLoading: false,
  });

  const handleOpenAddRecognitionDialog = () => {
    setState({ shouldShowAddRecognitionDialog: true });
  };

  const handleCloseAddRecognitionDialog = () => {
    setState({ shouldShowAddRecognitionDialog: false });
  };

  const init = async () => {
    setState({ isLoading: true });

    const response = await getRecognition();

    if (response?.success) {
      setState({
        recognition: response?.data,
      });
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
  };

  const handleAddRecognition = async (payload) => {
    const response = await addRecognition(payload);

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
      handleCloseAddRecognitionDialog();
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
                Recognition
              </div>
              <div>
                <Button
                  label="Give Recognition"
                  color="secondary"
                  onClick={handleOpenAddRecognitionDialog}
                  style={{
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#FFFFFF",
                    height: 40,
                  }}
                />
              </div>
            </div>

            {!state?.recognition?.length && (
              <div className="flex flex-col justify-center items-center mt-20">
                <span className="text-lg font-semibold">
                  No recognition available yet.
                </span>
              </div>
            )}

            <div className="mt-10">
              {state?.recognition?.map((elem) => (
                <div
                  key={elem?._id}
                  className="p-4 flex justify-between mt-4 card"
                >
                  <div>
                    <div className="text-sm">
                      <b className="member">
                        {elem.fromUser.firstName} {elem.fromUser.lastName}
                      </b>{" "}
                      shared some recognition with{" "}
                      <b className="member">
                        {elem.toUser.firstName} {elem.toUser.lastName}
                      </b>
                    </div>

                    <div className="text-xs my-2">{elem?.description}</div>

                    <span className="text-xs code-block code">
                      #{String(elem?.companyValue?.title).toLowerCase()}
                    </span>
                  </div>

                  <TwitterShareButton
                    onLoad={function noRefCheck() {}}
                    options={{
                      text: elem?.description,
                    }}
                    url="https://twitter.com/SJSU"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.shouldShowAddRecognitionDialog && (
        <AddRecognitionDialog
          open={state?.shouldShowAddRecognitionDialog}
          onClose={handleCloseAddRecognitionDialog}
          onSave={handleAddRecognition}
        />
      )}
    </div>
  );
}
