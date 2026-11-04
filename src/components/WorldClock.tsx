import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { FaCog, FaMoon, FaSun } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window";
import "./WorldClock.css";

export default function WorldClock() {
    const [currentTZ, setCurrentTZ] = useState("UTC");
    const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
    const [activePopup, setActivePopup] = useState<"timezone" | "settings" | null>(null);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [clockSize, setClockSize] = useState(270);

    const themeIcon = theme === "dark" ? <FaSun size={12} /> : <FaMoon size={12} />;
    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    const zones = useMemo(() => {
        const supported = (Intl as any).supportedValuesOf;
        console.log(supported("timeZone"));
        return supported
            ? supported("timeZone")
            : ["UTC"];
    }, []);
    

    const baseSize = 270;
    const scale = clockSize / baseSize;
    const center = clockSize / 2;
    const radius = center - clockSize * 0.085;

    const clockStyle: CSSProperties = {
        width: `${clockSize}px`,
        height: `${clockSize}px`,
        ["--clock-scale" as any]: scale,
        ["--font-size-xl" as any]: `${23 * scale}px`,
        ["--font-size-lg" as any]: `${20 * scale}px`,
        ["--font-size-md" as any]: `${14 * scale}px`,
        ["--font-size-sm" as any]: `${13 * scale}px`,
        ["--font-size-xs" as any]: `${12 * scale}px`,
        ["--title-top" as any]: `${70 * scale}px`,
        ["--hand-hour-width" as any]: `${4 * scale}px`,
        ["--hand-hour-height" as any]: `${70 * scale}px`,
        ["--hand-minute-width" as any]: `${3 * scale}px`,
        ["--hand-minute-height" as any]: `${90 * scale}px`,
        ["--hand-second-width" as any]: `${2 * scale}px`,
        ["--hand-second-height" as any]: `${100 * scale}px`,
        ["--center-dot-size" as any]: `${10 * scale}px`,
        ["--config-btn-size" as any]: `${24 * scale}px`,
        ["--config-padding" as any]: `${5 * scale}px`,
        ["--config-gap" as any]: `${5 * scale}px`,
        ["--config-radius" as any]: `${8 * scale}px`,
        ["--popup-padding" as any]: `${24 * scale}px`,
        ["--popup-radius" as any]: `${28 * scale}px`,
        ["--clock-border-width" as any]: `${3 * scale}px`,
    };

    function getTime(tz: string) {
        const now = new Date();

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).formatToParts(now);

        let h = 0, m = 0, s = 0;

        parts.forEach((p) => {
            if (p.type === "hour") h = +p.value;
            if (p.type === "minute") m = +p.value;
            if (p.type === "second") s = +p.value;
        });

        return { h, m, s };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTime(currentTZ));
        }, 1000);

        setTime(getTime(currentTZ));
        return () => clearInterval(interval);
    }, [currentTZ]);

    const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="clock-wrapper" onClick={() => setActivePopup(null)}>
            <div className={`clock ${theme}`} style={clockStyle}>

                <div className="title">WorldClock</div>

                <div className="time">
                    {String(time.h).padStart(2, "0")}:
                    {String(time.m).padStart(2, "0")}:
                    {String(time.s).padStart(2, "0")}
                </div>

                {/* Numbers */}
                {numbers.map((n) => {
                    const angle = (n * 30 - 90) * (Math.PI / 180);
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);

                    return (
                        <div
                            key={n}
                            className="num"
                            style={{ left: x, top: y }}
                        >
                            {n}
                        </div>
                    );
                })}

                {/* Hands */}
                <div
                    className="hand hour"
                    style={{
                        transform: `translateX(-50%) rotate(${(time.h % 12) * 30 + time.m * 0.5}deg)`
                    }}
                />
                <div
                    className="hand minute"
                    style={{
                        transform: `translateX(-50%) rotate(${time.m * 6}deg)`
                    }}
                />
                <div
                    className="hand second"
                    style={{
                        transform: `translateX(-50%) rotate(${time.s * 6}deg)`
                    }}
                />

                {/* timezone */}
                <div className="tzText" onClick={(e) => {
                    e.stopPropagation();
                    setActivePopup("timezone");
                }}>
                    <label>{currentTZ}</label>
                    <span>▼</span>
                </div>

                {/* Theme Switcher and Settings */}
                <div className="configBox" onClick={(e) => e.stopPropagation()}>
                    <div className="btn-sm" title="Theme" onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                    }}>
                        {themeIcon}
                    </div>
                    <div className="btn-sm" title="Settings" onClick={(e) => {
                        e.stopPropagation();
                        setActivePopup("settings");
                    }}>
                        <FaCog size={11} />
                    </div>
                    <div className="btn-sm" title="Close" onClick={async (e) => {
                        const window = getCurrentWindow();
                        await window.close();
                        e.stopPropagation();
                    }}>
                        <MdClose size={15} />
                    </div>
                </div>

                {/* popup */}
                {activePopup && (
                    <div className="popupOverlay" onClick={() => setActivePopup(null)}>
                        <div className="popup" onClick={(e) => e.stopPropagation()}>
                            <div className="topbar">
                                <div>{activePopup === "timezone" ? "Timezones" : "Settings"}</div>
                                <div onClick={() => setActivePopup(null)}>✕</div>
                            </div>

                            {activePopup === "timezone" ? (
                                <div className="list">
                                    {zones.map((z: string) => (
                                        <div
                                            key={z}
                                            className="item"
                                            onClick={() => {
                                                setCurrentTZ(z);
                                                setActivePopup(null);
                                            }}
                                        >
                                            {z}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="settingsBody">
                                    <div className="settingRow">
                                        <label htmlFor="clockSize">Clock size</label>
                                        <span className="settingValue">{clockSize}px</span>
                                    </div>

                                    <input
                                        id="clockSize"
                                        type="range"
                                        min={200}
                                        max={380}
                                        value={clockSize}
                                        onChange={async (e) => {
                                            const nextSize = Number(e.target.value);
                                            setClockSize(nextSize);
                                            const window = getCurrentWindow();
                                            await window.setSize(new PhysicalSize(nextSize, nextSize));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}