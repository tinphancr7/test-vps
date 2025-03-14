export const systemDiskCategories = (categories: Array<any>) => {
    if (!categories?.length) {
        return [];
    }

    return categories?.map((ct) => ({
        value: ct?.Value,
        label: getCategoryName(ct?.Value),
    }));
};

export const getCategoryName = (value: string) => {
    switch (value) {
        case "cloud":
            return "Basic disk";

        case "cloud_efficiency":
            return "Ultra disk";

        case "cloud_ssd":
            return "Standard SSD";

        case "ephemeral_ssd":
            return "Local SSD";

        case "cloud_essd_entry":
            return "ESSD Entry"

        case "cloud_essd":
            return "Enterprise SSD (ESSD)";

        case "cloud_auto":
            return "ESSD AutoPL Disk";
    }
};

export const generateInstanceFamilyNameBody = (InstanceTypeId: string) => {
    const parts = InstanceTypeId?.split(".");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_productCode, instanceFamily, _instanceSize] = parts;

    const name = generateInstanceFamilyName(instanceFamily);

    if (!name) return instanceFamily;

    const [nameSuffix] = instanceFamily.split("-");

    return `${name} Type ${nameSuffix}`;
};

export const getVCpus = (instanceTypeId: string) => {
    const part = instanceTypeId.split(".")?.pop() || "";

    const instanceSize = part.replace(/xlarge/, "");

    if (["small", "tiny", "nano"].includes(instanceSize)) {
        return 1;
    }

    if (["large", "medium"].includes(instanceSize)) {
        return 2;
    }

    if (!instanceSize) {
        return 4;
    }

    return Number(instanceSize) * 4;
};

const generateInstanceFamilyName = (id: string) => {
    let name = "";

    switch (id.charAt(0)) {
        case "c":
            name = "Compute-optimized";
            break;

        case "g":
            name = "General-purpose";
            break;

        case "u":
            name = "Universal";
            break;

        case "r":
            name = "Memory-optimized";
            break;

        case "i":
            name = "Local SSD";
            break;

        case "d":
            name = "Big data";
            break;

        case "s":
            name = "Shared";
            break;

        case "t":
            name = "Burstable";
            break;

        case "n":
            name = "Shared Compute";
            break;

        case "e":
            name = "Economy";
            break;
    }

    if (!name) {
        switch (id.slice(0, 2)) {
            case "re":
                return "High memory";

            case "hf":
                return "High memory";

            case "mn":
                return "Shared General-purpose";

            case "sn":
                return "Network-enhanced Compute-optimized";

            case "xn":
                return "Previous-generation Shared";
        }
    }

    return name;
};

export const calculatorFeeProvisionedPerformance = (provisionedIops: number) => {
    const roundTo7Decimals = (value: number): number => {
        const epsilon = 1e-14; // Một giá trị nhỏ để tránh sai số khi xử lý dấu phẩy động
        return parseFloat((value + epsilon).toFixed(7));
    };

    const unitPriceOfProvisionedPerformance = 0.00000625;
    const subscriptionDuration = 24 * 30; // 24 hour and 30 days

    const calculator =
        unitPriceOfProvisionedPerformance *
        provisionedIops *
        subscriptionDuration;

    return roundTo7Decimals(calculator);
};
