import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import HeaderTen from "../../layouts/headers/HeaderTen";
import {
  clearAllNotificationApi,
  deleteNotificationApi,
  notificationPageApi,
} from "../../apiServices/igplApi";

const formatNotificationDate = (dateString: any) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  // Explicitly use AM/PM format
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today, ${time}`;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else {
    return `${date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  }
};

const gradientClasses = ["gradient-1", "gradient-2"];

const getGradientClass = (id: string) => {
  const index = Number(id) % gradientClasses.length;
  return gradientClasses[index];
};

const NotificationComponent: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [notificationPageData, setNotificationPageData] = useState<any | null>(
    null
  );

  const handleClickBack = () => {
    navigate(-1);
  };

  const fetchNotificationApi = async () => {
    setLoading(true);
    try {
      const response = await notificationPageApi();
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error(
          "Failed to fetch Notification Page Api:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetchNotificationApi:", error);
    } finally {
      setLoading(false);
    }
  };

  const notificationDeleteApi = async (notify_id: any) => {
    setLoading(true);
    try {
      const response = await deleteNotificationApi(notify_id);
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error("Failed to fetch Notification Page Api:");
      }
    } catch (error) {
      console.error("Error notificationDeleteApi:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearnotificationApi = async (notify_id: any) => {
    setLoading(true);
    try {
      const response = await clearAllNotificationApi();
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error(
          "Failed to fetch Notification Page Api:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error clearnotificationApi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationApi();
  }, []);

  const handleDeleteNotification = (notify_id: any) => {
    notificationDeleteApi(notify_id);
    fetchNotificationApi();
  };

  return (
    <>
      <ScrollTop />
      <HeaderTen />
      <div className="page-content-wrapper py-2 direction-rtl">
        <div className="container direction-rtl p-2">
          {notificationPageData?.list.length === 0 ? (
            <div
              style={{
                width: "85%",
                margin: "3rem auto",
                background: "linear-gradient(135deg, #f9f9f9, #eef2f7)",
                borderRadius: "16px",
                padding: "2rem 1.5rem",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  src={`/assets/img/no-notifications.png`}
                  alt="no-tournaments"
                  width="120"
                  style={{
                    opacity: 0.9,
                    marginBottom: "1rem",
                  }}
                />
                <h5
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#adadad",
                    marginBottom: "0.5rem",
                  }}
                >
                  No Notofication yet!
                </h5>
                <p className="fw-semibold">
                  when you recieve notifications, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              {notificationPageData?.list.length !== 0 && (
                <div
                  className="card p-2 mb-2"
                  style={{
                    backgroundColor: "linear-gradient(0deg, rgb(5, 76, 138))",
                  }}
                >
                  <button
                    className="btn btn-link text-danger"
                    style={{ textDecoration: "none" }}
                    onClick={clearnotificationApi}
                  >
                    CLEAR ALL
                  </button>
                </div>
              )}

              {notificationPageData?.list?.map((notification: any, index: any) => {
                const gradientClass = getGradientClass(index);
                return(
                <div
                  key={notification.notify_id}
                  className={`card px-3 p-2 mb-2 dark-mode-tournament-item ${gradientClass} border border-2`}
                  style={{
                    // background: "linear-gradient(0deg, rgb(5, 76, 138))",
                    borderRadius: "30px 30px 5px 5px",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div className="dark-mode-tournament-item-p">
                      <p className="dark-mode-tournament-item-p">
                        <strong>{notification.notify_title}</strong>
                      </p>
                      <p
                        className="dark-mode-tournament-item-p fw-semibold"
                        dangerouslySetInnerHTML={{
                          __html: notification.notify_description,
                        }}
                      />
                      <small className="text-white fw-semibold">
                        {formatNotificationDate(notification.added_on)}
                      </small>
                    </div>
                    <button
                      className="btn btn-link text-danger"
                      style={{ fontSize: "1.5em" }}
                      onClick={() =>
                        handleDeleteNotification(notification.notify_id)
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              )})}
            </>
          )}
        </div>
      </div>
      <FooterTwo />
    </>
  );
};

export default NotificationComponent;
