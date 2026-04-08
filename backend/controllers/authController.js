const User = require("../models/userModel");
const crypto = require("crypto");

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
  };
  if (process.env.NODE_ENV === "production") options.secure = true;

  user.password = undefined;
  res.status(statusCode).cookie("token", token, options).json({ success: true, token, user });
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, role: role || "buyer" });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please enter email and password" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get current user
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = { name: req.body.name, address: req.body.address };
    if (req.body.avatar) updates.avatar = req.body.avatar;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "User not found with this email" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In production, send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    res.status(200).json({ success: true, message: "Reset token generated", resetUrl });
  } catch (err) {
    next(err);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Reset token invalid or expired" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
