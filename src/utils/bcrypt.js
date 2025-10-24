import crypto from "crypto";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const customHash = crypto.createHash("sha256").update(password).digest("hex");
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(customHash, salt);
};
