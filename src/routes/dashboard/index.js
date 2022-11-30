import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import Spinner from "components/Spinner";
import { useMergeState } from "utils/custom-hooks";
import { USER_ROLES } from "utils/constants";
import { getStats } from "api";

export default function DashboardContainer(props) {
  const { user } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    organization: {
      totalFeedbackReceived: 0,
      totalWorkHours: 0,
      totalDisbursements: 0,
    },
    team: {
      totalFeedbackReceived: 0,
      totalWorkHours: 0,
      totalDisbursements: 0,
    },
    personal: {
      totalFeedbackShared: 0,
      totalHoursWorked: 0,
      totalEarnings: 0,
    },
    isLoading: false,
  });

  const init = async () => {
    setState({ isLoading: true });

    const response = await getStats();

    if (response?.success) {
      setState(response?.data);
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }

    setState({ isLoading: false });
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
          <div className="text-3xl font-semibold text-grey">Overview</div>

          {user?.role === USER_ROLES.ADMIN && (
            <div className="mt-10">
              <div className="font-semibold">Organization Stats</div>

              <div className="mt-4 flex justify-between">
                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total feedback received
                  </span>
                  <span className="font-semibold">
                    {state?.organization?.totalFeedbackReceived}
                  </span>
                </div>

                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total work hours
                  </span>
                  <span className="font-semibold">
                    {state?.organization?.totalWorkHours}
                  </span>
                </div>

                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total disbursements this month
                  </span>
                  <span className="font-semibold">
                    {parseFloat(
                      state?.organization?.totalDisbursements
                    ).toFixed(2)}{" "}
                    USD
                  </span>
                </div>
              </div>
            </div>
          )}

          {user?.role === USER_ROLES.MANAGER && (
            <div className="mt-10">
              <div className="font-semibold">Team Stats</div>

              <div className="mt-4 flex justify-between">
                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total feedback received
                  </span>
                  <span className="font-semibold">
                    {state?.team?.totalFeedbackReceived}
                  </span>
                </div>

                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total work hours
                  </span>
                  <span className="font-semibold">
                    {state?.team?.totalWorkHours}
                  </span>
                </div>

                <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                  <span className="text-xs text-gray-500">
                    Total disbursements this month
                  </span>
                  <span className="font-semibold">
                    {parseFloat(state?.team?.totalDisbursements).toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <div className="font-semibold">Your Stats</div>

            <div className="mt-4 flex justify-between">
              <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                <span className="text-xs text-gray-500">
                  Total feedback shared
                </span>
                <span className="font-semibold">
                  {state?.personal?.totalFeedbackShared}
                </span>
              </div>

              <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                <span className="text-xs text-gray-500">
                  Total hours worked
                </span>
                <span className="font-semibold">
                  {state?.personal?.totalHoursWorked}
                </span>
              </div>

              <div className="w-64 flex flex-col items-center rounded-md p-2 border-2 bg-slate-100">
                <span className="text-xs text-gray-500">
                  Total earnings this month
                </span>
                <span className="font-semibold">
                  {parseFloat(state?.personal?.totalEarnings).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
