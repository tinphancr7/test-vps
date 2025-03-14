import { isArray, isNaN, isNil, isNumber, omitBy} from "lodash";
export const getPageIndex = (param: string | (string | null)[] | null) => {
  if (isArray(param)) {
    param = param[0];
  }

  if (isNil(param)) {
    return "1";
  }

  const parsedParam = parseFloat(param);
  if (
    isNumber(parsedParam) &&
    !isNaN(parsedParam) &&
    param.toString().indexOf(".") !== -1
  ) {
    return "1";
  }

  return param;
};

export const getPageSize = (
  param: string | (string | null)[] | null,
  pageSize: number = 10
) => {
  if (isArray(param)) {
    param = param[0];
  }

  if (isNil(param)) {
    return pageSize.toString();
  }

  const parsedParam = parseFloat(param);
  if (
    isNumber(parsedParam) &&
    !isNaN(parsedParam) &&
    param.toString().indexOf(".") !== -1
  ) {
    return pageSize.toString();
  }

  return param;
};

export const getSearchKeyword= (
  param: string | (string | null)[] | null,
) => {
  if (isArray(param)) {
    param = param[0];
  }

  if (isNil(param)) {
    return '';
  }

  return param;
};

type Cleanable = string | (string | null)[] | null | undefined;

export const cleanObjectByQuery = <T extends Record<string, Cleanable>>(obj: T): Partial<T> => {
  return omitBy(
    obj,
    (value) =>
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) &&
        value.every((item) => item === null || item === ""))
  ) as Partial<T>;
}
