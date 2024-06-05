import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import { FaRegCalendarAlt } from "react-icons/fa";

const SeeNotice = () => {
  const dispatch = useDispatch();
  const { currentUser, currentRole } = useSelector((state) => state.user);
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const userId =
          currentRole === "Admin" ? currentUser._id : currentUser._id;
        dispatch(getAllNotices(userId, "Notice", currentRole));
      } catch (error) {
        console.log("Error fetching notices:", error);
      }
    };
    fetchNotices();
  }, [dispatch, currentRole, currentUser]);

  const noticeRows = noticesList.map((notice) => ({
    title: notice.title,
    details: notice.details,
    recipient: notice.recipient,
    date: new Date(notice.date).toISOString().substring(0, 10),
    id: notice._id,
  }));

  return (
    <div className="mt-8 mr-4">
      {loading ? (
        <div className="text-lg">Loading...</div>
      ) : response ? (
        <div className="text-lg">No Notices to Show Right Now</div>
      ) : (
        <>
          <h3 className="text-2xl mb-8">Notices</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {noticeRows.map((notice, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm leading-5 font-medium text-gray-900">
                            {notice.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-900">
                        {notice.details}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-900">
                        {notice.recipient}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-900 flex items-center">
                        <FaRegCalendarAlt className="mr-2" />
                        {notice.date}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SeeNotice;
