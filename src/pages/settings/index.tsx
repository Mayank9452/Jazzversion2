import { Link } from "react-router-dom";
import HeaderSeven from "../../layouts/headers/HeaderSeven";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../common/ScrollTop";
import { useEffect, useState } from "react";
import {
  changeProfileImage,
  fetchManageProfile,
  updateProfileImage,
} from "../../apiServices/igplApi";
import { useAvatar } from "../../context/AvatarContext";
import SpinnersArea from "../spinners/SpinnersArea";

export const phoneShowFormat = (phone: string | undefined): string => {
  if (!phone) return ""; // Handle undefined/null
  if (phone.length <= 6) return phone; // If too short, return as is

  const first = phone.slice(0, 3);
  const last = phone.slice(-3);
  const masked = "*".repeat(phone.length - 6);

  return `${first}${masked}${last}`;
};

const Settings = () => {
  const { avatar, setAvatar } = useAvatar();
  const [showModal, setShowModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [manageProfileData, setManageProfileData] = useState<any | null>(null);
  const [profileImageApiData, setProfileImageApiData] = useState<any | null>(
    null
  );
  const [profileImageId, setProfileImageId] = useState<any>("");

  useEffect(() => {
    // Fetch avatars when the component mounts
    fetchJazzManageProfile();
    fetchJazzUpdateProfileImage();
  }, []);

  const fetchJazzManageProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchManageProfile();
      if (response.status) {
        setManageProfileData(response?.data);
      } else {
        console.log("failed to fetchManagaeProfile");
      }
    } catch (error) {
      console.log("Error fetching Manage Profile API", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJazzUpdateProfileImage = async () => {
    setLoading(true);
    try {
      const response = await updateProfileImage();
      if (response.status) {
        setProfileImageApiData(response?.data?.maleList);
      } else {
        console.log("failed to updateProfileImageApi");
      }
    } catch (error) {
      console.log("Error fetching updateProfileImageApi", error);
    } finally {
      setLoading(false);
    }
  };

  const changeProfilePic = async (image_id: string) => {
    setLoading(true);
    try {
      const response = await changeProfileImage(image_id);
      if (response.status) {
        tempAvatar && setAvatar(tempAvatar);
      } else {
        console.log("failed to changeProfileImageApi");
      }
    } catch (error) {
      console.log("Error fetching changeProfileImageApi", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <SpinnersArea />}
      {!loading && (
        <>
          <ScrollTop />
          <HeaderSeven />

          <div className="page-content-wrapper py-2 d-flex justify-content-center align-items-center min-vh-90">
            <div className="container">
              {/* Account Setup Card */}
              <div className="card mb-2 shadow-sm border-0 bg-transparent">
                <div className="card-body text-center rounded-2">
                  {/* <h5 className="fw-bold mb-3 text-muted">Account Setup</h5> */}

                  <div className="d-flex flex-column justify-content-evenly align-items-center ">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <img
                        src={
                          avatar || "https://igpl.pro/uploads/site_users/9.png"
                        }
                        alt="Profile"
                        className="rounded-circle mb-2"
                        width="70"
                        height="70"
                      />
                    </div>

                    <div className=" mb-0">
                      <p
                        className="text-muted dark-mode-tournament-item-p m-0"
                        style={{ fontWeight: "700" }}
                      >
                        {phoneShowFormat(
                          manageProfileData?.userInfo?.user_phone
                        )}
                      </p>
                      <div className="content-wrapper">
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            profileImageApiData && setShowModal(true);
                          }}
                          className="btn btn-outline px-4 py-2 rounded-pill fw-semibold cursor"
                          style={{ color: "#fecb13" }}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Update Profile Image
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Options */}
              {[
                // {
                //   to: "/profile/tournamentHistory",
                //   icon: "trophy",
                //   label: "Tournament History",
                //   bg: "primary",
                //   bkColor: "linear-gradient(to right, #35b6a9, #4bded4)",
                // },
                {
                  to: "/profile/notification",
                  icon: "bell",
                  label: "Notifications",
                  bg: "info",
                  bkColor: "linear-gradient(0deg,rgba(128, 199, 197, 1) 24%, rgba(153, 210, 208, 1) 63%)",
                },
                {
                  to: "/profile/privacy-policy",
                  icon: "shield-lock",
                  label: "Privacy Policy",
                  bg: "danger",
                  bkColor: "linear-gradient(0deg,rgba(254, 203, 19, 1) 12%, rgba(254, 218, 89, 1) 80%)",
                },
                {
                  to: "/profile/terms-and-conditions",
                  icon: "file-earmark-text",
                  label: "Terms & Conditions",
                  bg: "success",
                  bkColor: "linear-gradient(0deg,rgba(128, 199, 197, 1) 24%, rgba(153, 210, 208, 1) 63%)",
                },
                {
                  to: "",
                  icon: "person-x",
                  label: "Unsubscribe",
                  bg: "danger",
                  bkColor:
                    "linear-gradient(0deg,rgba(254, 203, 19, 1) 12%, rgba(254, 218, 89, 1) 80%)",
                },
              ].map((item, idx) => (
                <div key={idx} className="card mb-2 shadow-sm border-0">
                  <Link
                    to={item.to}
                    className="card-body d-flex align-items-center text-decoration-none py-3 rounded"
                    style={{ background: item.bkColor }}
                  >
                    <div
                      className={`bg-${item.bg} text-white d-flex align-items-center justify-content-center rounded-circle me-3`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className={`bi bi-${item.icon}`}></i>
                    </div>
                    <div className="fw-semibold text-dark">{item.label}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(2px)",
                zIndex: 1050,
              }}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                style={{ maxHeight: "90vh" }}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h6 className="modal-title">Select Your Avatar</h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <div className="row">
                      {profileImageApiData?.map((avatar: any) => (
                        <div
                          key={avatar.avatar_id}
                          className="col-3 mb-3 text-center"
                        >
                          <img
                            src={avatar.user_image_url}
                            alt={`Avatar ${avatar.avatar_id}`}
                            className={`img-thumbnail ${
                              tempAvatar === avatar.user_image_url
                                ? "border-primary border-3"
                                : ""
                            }`}
                            style={{
                              cursor: "pointer",
                              width: "100%",
                              borderRadius: "10px",
                            }}
                            onClick={() => {
                              setProfileImageId(avatar.id);
                              setTempAvatar(avatar.user_image_url);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn text-danger"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-outline text-primary border-dark border-2"
                      onClick={() => {
                        if (tempAvatar && profileImageId) {
                          changeProfilePic(profileImageId);
                          setAvatar(tempAvatar); // Update global state + localStorage
                        }
                        setShowModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <FooterTwo />
        </>
      )}
    </>
  );
};

export default Settings;
