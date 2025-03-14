/**
 * Hàm hiển thị memory
 * @param memory memory ở dạng MB
 * @returns
 */
export const handleDisplayMemory = (memory: number) => {
    const SIZE_OF_1_GB_TO_MB = 1024;
    if (memory < SIZE_OF_1_GB_TO_MB) {
        return memory + " MB";
    }
    return convertMBtoGB(memory) + " GB";
};
export const getNameOfImage = (selectedImage: any, slugImage: any) => {
    const data = selectedImage?.data?.find((item: any) => {
        return item?.slug === slugImage;
    });
    return data?.description;
};
export enum EnumBillingTypeDigitalOcean {
    INVOICE = "Invoice",
    PAYMENT = "Payment",
}

export const eventAction = (type: string) => {
    switch (type) {
        case "shutdown":
            return "Tắt nguồn";
        case "reboot":
            return "Khởi động lại";
        case "power_cyle":
            return "Khởi động lại";
        case "power_on":
            return "Bật nguồn";
        case "rebuild":
            return "Cài đặt lại hệ thống";
        default:
            return type;
    }
};
export const stringInfoVps = (data: any) => {
    const cpu = data?.selectedSize?.vcpus + " CPUs";
    const memory = handleDisplayMemory(data?.selectedSize?.memory);
    const disk = data?.selectedSize?.disk + " GB";
    const addDisk =
        data?.storage_id?.length > 0
            ? ` + ${data?.addStorage?.size_gigabytes} GB`
            : "";
    const selectedRegion = data?.selectedDataCenter?.toUpperCase();
    const selectedImage = getNameOfImage(
        data?.selectedImage,
        data?.selectedVersionImage
    );
    // const selectedImage = data?.selectedImage?.description;

    return (
        cpu +
        " / " +
        memory +
        " / " +
        disk +
        addDisk +
        " / " +
        selectedRegion +
        " - " +
        (selectedImage || data?.selectedVersionImage)
    );
};

/**
 * Convert memory size from MB to GB
 * @param mb memory size (MB)
 * @returns {number} memory size (GB)
 */
export function convertMBtoGB(mb: number): number {
    return parseFloat((mb / 1024).toFixed(2));
}

/**
 * Hàm hiển thị disk transfer
 * @param diskSize
 */
export const handleDisplayDiskTransfer = (diskSize: number) => {
    if (diskSize < 2) {
        return diskSize * 1000 + " GB";
    }
    return diskSize + " TB";
};

export const convertPriceMonthly = (value: number) => {
    return value.toFixed(2) + " $";
};

export const convertPriceToUSD = (value: number) => {
    let valueOutput = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    valueOutput += " $";

    return valueOutput;
};

export const convertPriceToUSD2 = (value: any) => {
    const numberValue = parseFloat(value);
    const formattedNumber = numberValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formattedNumber + " $";
};

export const convertDurationToHour = (value: string, value_unit: string) => {
    return value + " " + value_unit;
};

export const convertPriceMonthlyWithStr = (value: number) => {
    return value.toFixed(2) + "$ / tháng";
};

export function hideFromStart(
    inputString: string,
    hideLength: number,
    visibleLength: number
) {
    if (inputString) {
        // Kiểm tra điều kiện nếu hideLength cộng visibleLength lớn hơn hoặc bằng độ dài chuỗi đầu vào
        if (hideLength + visibleLength >= inputString.length) {
            return inputString;
        }
        // Tạo phần đã ẩn với các ký tự '*' và nối với phần còn lại của chuỗi không bị ẩn
        const hiddenPart = "*".repeat(hideLength);
        const visiblePart = inputString.slice(-visibleLength);

        return hiddenPart + visiblePart;
    }
}

export function convertInvoiceString(invoiceString: string) {
    const monthMap: any = {
        January: "Tháng 1",
        February: "Tháng 2",
        March: "Tháng 3",
        April: "Tháng 4",
        May: "Tháng 5",
        June: "Tháng 6",
        July: "Tháng 7",
        August: "Tháng 8",
        September: "Tháng 9",
        October: "Tháng 10",
        November: "Tháng 11",
        December: "Tháng 12",
    };

    // Tách chuỗi thành các phần
    const parts = invoiceString.split(" ");

    // Kiểm tra điều kiện đầu vào
    if (parts.length < 4 || parts[0] !== "Invoice" || parts[1] !== "for") {
        return "Định dạng chuỗi không đúng";
    }

    // Lấy tháng và năm
    const month = parts[2];
    const year = parts[3];

    // Chuyển đổi tháng sang tiếng Việt
    const monthInVietnamese = monthMap[month] || month;

    // Tạo chuỗi kết quả
    const result = `Hóa đơn ${monthInVietnamese} Năm ${year}`;
    return result;
}
