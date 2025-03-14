export const parseDesVpsVng = (str: string) => {
    const obj: any = {};
  
    str.split("<br>").forEach((item, index) => {
      if (index < str.split("<br>").length - 1) {
        const [key, value] = item.split(":");
        obj[key === "Bandwidth" ? "Data Transfer" : key] = value;
      }
    });
    return obj;
};