export const bgColorStatusDomain = (status: string) => {
    switch (status) {
        case "new":
            return "bg-primary-500";

        case "seo":
            return "bg-success";

        case "301":
            return "bg-warning";

        case "pause":
            return "bg-yellow-500";

        case "pbn":
            return "bg-secondary";

        case "satellite":
            return "bg-sky-500";

        case "do-not-use":
            return "bg-danger";

        default:
            return "bg-default-500";
    }
};