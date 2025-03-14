import { createSlice } from "@reduxjs/toolkit";

interface BackupI {
  backups: boolean;
  rateCostForBackup: number;
}
interface DigitalOceanBackup {
  backupsOption: BackupI;
}
const initialState: DigitalOceanBackup = {
  backupsOption: {
    backups: false,
    rateCostForBackup: 0,
  },
};

const digitalOceanBackupSlice = createSlice({
  name: "digitalOceanBackupSlice",
  initialState,
  reducers: {
    setDataBackupDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataBackupDigitalOcean } = digitalOceanBackupSlice.actions;

export default digitalOceanBackupSlice.reducer;
