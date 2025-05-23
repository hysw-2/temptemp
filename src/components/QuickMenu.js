import React from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
    { label: "법안 검색", path: "/", icon: "/icons/search.png" },
    { label: "추천 법안", path: "/recommend", icon: "/icons/recommend.png" },
    { label: "법안 랭킹", path: "/ranking", icon: "/icons/rank.png" },
    { label: "법안 토의", path: "/discussion", icon: "/icons/discuss.png" },
    { label: "법안 리스트", path: "/bills", icon: "/icons/list.png" },
];

const QuickMenu = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.wrapper}>
            {menuItems.map((item, idx) => (
                <div
                    key={idx}
                    onClick={() => navigate(item.path)}
                    style={styles.menuItem}
                >
                    <div style={styles.iconWrapper}>
                        <img src={item.icon} alt={item.label} style={styles.icon} />
                    </div>
                    <div style={styles.label}>{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    wrapper: {
        width: "50vw",
        margin: "40px auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    menuItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease",
    },
    iconWrapper: {
        width: 80,
        height: 80,
        backgroundColor: "#f5f5f5",
        borderRadius: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    icon: {
        width: 70,
        height: 70,
        objectFit: "contain",
    },
    label: {
        fontSize: "16px",
        color: "#111",

    },
};

export default QuickMenu;
