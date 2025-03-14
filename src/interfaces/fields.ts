export interface Fields {
    label?: string;
    placeholder?:string;
    type?: string;
    isRequire?: boolean;
    options?: Array<any>;
    value: any;
    max?: string | number | undefined;
    errorMessage?: string;
    emptyMessage?: string;
}