import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
// import { useAvatar } from "../../context/AvatarContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    fetchJazzSpinWinInfoThunk,
    fetchJazzSpinJSONThunk,
    processJazzSpinWinThunk
} from "../features/jazzSpinWin/jazzSpinWinSlice";
import { useNavigate } from "react-router-dom";

const userName = localStorage.getItem("username");
// Function to parse wheelTextSize (e.g., "2.2em") into pixels
const parseWheelTextSize = (size: string | undefined): number => {
    if (!size) return 24; // Default font size if undefined
    const match = size.match(/([\d.]+)(em|px)/); // Extract number and unit
    if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        if (unit === "em") {
            // Assume 1em = 16px (base font size)
            return Math.round(value * 16);
        } else if (unit === "px") {
            return Math.round(value);
        }
    }
    return 24; // Fallback if parsing fails
};

export const phoneShowFormat = (phone: string | undefined): string => {
    if (!phone) return ""; // Handle undefined/null
    if (phone.length <= 6) return phone; // If too short, return as is

    const first = phone.slice(0, 3);
    const last = phone.slice(-3);
    const masked = "*".repeat(phone.length - 6);

    return `${first}${masked}${last}`;
};

const SpinPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // const { avatar } = useAvatar();
    const [spinWinData, setSpinWinData] = useState<any | null>(null);
    const [spinCheck, setSpinCheck] = useState<any | null>(null);
    const [spinWinProcess, setSpinWinProcess] = useState<any | null>(null);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [resultText, setResultText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [getPlaycoin, setPlaycoin] = useState<any>("");
    const [textToShow, setTextToShow] = useState<string>("Skip");

    useEffect(() => {
        fetchSpinAndWin();
        fetchGetSpinJSON();
        setPlaycoin(localStorage.getItem("playCoins"));
    }, []);

    useEffect(() => {
        if (spinWinData) {
            setIsLoading(false);
        }
    }, [spinWinData]);

    const fetchGetSpinJSON = async () => {
        try {
            setIsLoading(true);
            const resultAction = await dispatch(fetchJazzSpinJSONThunk());
            if (fetchJazzSpinJSONThunk.fulfilled.match(resultAction)) {
                const response = resultAction.payload;
                if (response) {
                    setSpinWinData(response);
                }
            }
            // else {
            //     setError("Failed to fetch spin data");
            //     console.error("Failed to fetch SpinWinJSON");
            // }
        } catch (error) {
            setError("Error fetching spin data");
            console.error("Error fetching SpinWinJSON:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const processSpinWinApi = async (wheel_id: number) => {
        try {
            const resultAction = await dispatch(processJazzSpinWinThunk(wheel_id));
            if (processJazzSpinWinThunk.fulfilled.match(resultAction)) {
                const response = resultAction.payload;
                if (response.status && response.data) {
                    setSpinWinProcess(response.data);
                    setSpinCheck(response);
                    if (response?.status === "success") {
                        setTextToShow("Ok");
                    }
                }
            }
            // else {
            //     console.error("Failed to fetch SpinWinJSON");
            // }
        } catch (error) {
            console.error("Error fetching SpinWinJSON:", error);
        }
    };

    const fetchSpinAndWin = async () => {
        try {
            const resultAction = await dispatch(fetchJazzSpinWinInfoThunk());
            if (fetchJazzSpinWinInfoThunk.fulfilled.match(resultAction)) {
                const response = resultAction.payload;
                if (response) {
                    if (response?.status) {
                        setTextToShow("Skip");
                    } else {
                        setTextToShow("Ok");
                    }
                    setSpinCheck(response);
                }
            }
            // else {
            //     console.error("Failed to fetch Spin and Win");
            // }
        } catch (error) {
            console.error("Error fetching fetchSpinAndWin:", error);
        }
    };

    // Fallback data to prevent crashes
    const defaultSegments = ["100", "50", "200", "50", "300", "400", "450", "500", "10"];
    const defaultColors = [
        "#364C62", "#F1C40F", "#E67E22", "#E74C3C",
        "#98985A", "#95A5A6", "#16A085", "#27AE60", "#2980B9"
    ];

    const segments = spinWinData?.segmentValuesArray?.map((item: any) => item.value) || defaultSegments;
    const colors = spinWinData?.colorArray?.slice(0, segments.length) || defaultColors;

    const data = segments.map((segment: string, i: number) => ({
        option: segment,
        style: {
            backgroundColor: colors[i] || defaultColors[i % defaultColors.length],
            textColor: spinWinData?.wheelTextColor || "white",
            fontSize: parseWheelTextSize(spinWinData?.wheelTextSize) || 24
        }
    }));

    const onSpinClick = () => {
        if (!mustSpin && data.length > 0 && spinCheck?.status) {
            const newPrizeNumber = Math.floor(Math.random() * data.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    };


    const handleSpinStop = () => {
        setMustSpin(false);
        const result = data[prizeNumber]?.option;

        // Ensure result is a string to match API response
        const segmentData = spinWinData?.segmentValuesArray?.find((item: any) => item.value === String(result));

        setResultText(segmentData ? segmentData.resultText : spinWinData?.invalidSpinText || "😢 Missed! Try again");

        // Process spin win if numSpins is available
        if (spinWinData?.numSpins && spinWinData.numSpins > 0) {
            processSpinWinApi(segmentData?.id);
        }
    };


    const handleBackToHome = () => {
        navigate("/");
    }


    if (error) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
                <div className="text-danger">{error}</div>
                <button
                    className="btn text-white mt-2 px-4 py-2"
                    style={{ background: "rgb(0, 213, 255)" }}
                    onClick={() => {
                        setError(null);
                        fetchGetSpinJSON();
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
                <div>Loading...</div>
            </div>
        );
    }



    return (

        <div className="page-content-wrapper py-2 direction-rtl ">
            <div className="container direction-rtl rounded">
                <div className="d-flex flex-column align-items-center justify-content-start">

                    {/* Profile & Coin Balance Header */}
                    <div className=" shadow-sm w-100 mb-2 rounded-pill px-4 py-2 d-flex justify-content-between align-items-center rounded" >
                        {/* <div className="d-flex align-items-center">
                            <img src={avatar || ""} alt="Avatar" className="rounded-circle me-2" style={{ width: 32, height: 32 }} />
                            <h6 className="dark-mode-heading-color" style={{ marginBottom: "0rem", fontSize: "16px", }}>Hello, {(userName === null || userName === "null") ? "" : userName}</h6>
                        </div> */}
                        <div className="d-flex align-items-center">
                            {/* <img src="/coin-icon.png" alt="Coins" className="me-2" style={{ width: 24, height: 24 }} /> */}
                            <img src="/assets/img/gold-coins.png" width={16} alt="" />
                            <h6 className="mb-0 ms-2" style={{ fontSize: "16px" }}>{getPlaycoin}</h6>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="position-relative">
                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                data={data}
                                outerBorderColor={spinWinData?.wheelStrokeColor || "rgb(0, 213, 255)"}
                                outerBorderWidth={spinWinData?.wheelStrokeWidth || 10}
                                innerBorderColor={spinWinData?.centerCircleStrokeColor || "rgb(0, 213, 255)"}
                                innerBorderWidth={spinWinData?.centerCircleStrokeWidth || 5}
                                radiusLineColor={spinWinData?.segmentStrokeColor || "rgb(0, 213, 255)"}
                                radiusLineWidth={spinWinData?.segmentStrokeWidth || 2}
                                fontSize={parseWheelTextSize(spinWinData?.wheelTextSize) || 24}
                                textDistance={spinWinData?.wheelTextOffsetY || 70}
                                perpendicularText={true}
                                spinDuration={spinWinData?.minSpinDuration ? spinWinData.minSpinDuration / 10 : 0.3}
                                onStopSpinning={handleSpinStop}
                                startingOptionIndex={0}
                                backgroundColors={colors}
                                textColors={spinWinData?.wheelTextColor}
                            />
                            {!mustSpin && (
                                <div
                                    className="position-absolute d-flex justify-content-center align-items-center top-50 start-50 translate-middle text-center"
                                    style={{
                                        width: `${spinWinData?.centerCircleSize || 180}px`,
                                        height: "80px",
                                        backgroundColor: spinWinData?.centerCircleFillColor || "rgb(0, 213, 255)",
                                        // color: spinWinData?.wheelTextColor || "white",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        zIndex: "11",


                                    }}
                                    onClick={onSpinClick}
                                >
                                    <strong>{spinWinData?.introText || "CLICK TO SPIN!"}</strong>
                                </div>
                            )}
                        </div>
                        {!mustSpin && resultText && (
                            <div className={`mt-3 ${resultText.includes("WON") ? "text-success" : "text-danger"} fw-bold`}>
                                {resultText}
                            </div>
                        )}
                        {spinWinData?.numSpins === 0 && (
                            <div className="mt-3 text-danger fw-bold">
                                {spinWinData?.gameOverText || "COME BACK TOMORROW TO PLAY AGAIN!"}
                            </div>
                        )}

                        <button
                            className="btn text-white mt-2 px-4 py-2"
                            style={{ fontSize: "18px", background: "#80c7c5" }}
                            onClick={handleBackToHome}
                        >
                            {textToShow}
                        </button>
                    </div>

                    <div className=" text-center fs-9 fw-semibold shadow-sm w-100 my-2 rounded-pill px-4 py-2 d-flex justify-content-between align-items-center rounded dark-mode-heading-color" >{spinCheck?.message}</div>

                </div>
            </div>
        </div>
    );
};

export default SpinPage;


