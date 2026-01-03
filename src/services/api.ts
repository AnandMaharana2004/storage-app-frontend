import { userService } from "./userService";
import { fileService } from "./fileService";
import { folderService } from "./folderService";

// Unified API export to maintain backward compatibility with components importing 'api'
export const api = {
  ...userService,
  ...fileService,
  ...folderService,
};
