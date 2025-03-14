export enum CYCLE_TIME {
    MONTHLY = "m",
    QUARTERLY = "q",
    SEMI_ANNUALLY = "s",
    ANNUALLY = "a",
}

export const cycleTime = [
    {
        id: CYCLE_TIME.MONTHLY,
        name: "Giá theo 1 tháng",
        extra: "1 tháng",
    },
    {
        id: CYCLE_TIME.QUARTERLY,
        name: "Giá theo 3 tháng",
        extra: "3 tháng",
    },
    {
        id: CYCLE_TIME.SEMI_ANNUALLY,
        name: "Giá theo 6 tháng",
        extra: "6 tháng",
    },
    {
        id: CYCLE_TIME.ANNUALLY,
        name: "Giá theo 1 năm",
        extra: "1 năm",
    },
];