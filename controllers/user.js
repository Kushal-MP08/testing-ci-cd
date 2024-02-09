const User = require("../model/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//creating a schema object for validation of user data
const userSignupSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  // middleName: Joi.string(),
  lastName: Joi.string().required(),
  // userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  // age: Joi.number().required().min(0).max(100),
  // DOB: Joi.date().greater(new Date("1940-01-01")).required(),
  // address: {
  //   addressLine: Joi.string().max(50).required(),
  //   state: Joi.string().max(15).required(),
  //   country: Joi.string().max(20).required(),
  //   zipCode: Joi.string().max(7).required(),
  // },
  // phoneNumber: Joi.string()
  //   .length(10)
  //   .pattern(/[6-9]{1}[0-9]{9}/)
  //   .required(),
  role: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
  // confirmPassword: Joi.ref("password"),
});

//functions for signup and login functions
async function handleUserSignup(req, res) {
  try {
    // Validate request body using Joi schema
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      console.error(error, "inside");
      return res.status(400).json({ error: error.details[0].message });
    }
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Create new user

    const newUser = new User({ firstName, lastName, email, password, role });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      "User Details": newUser,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  // console.log(user);
  if (!user)
    return res.status(404).json({ error: "Invalid Email Id or Password" });
  const validPassword = await bcrypt.compare(password, user.password);
  console.log(validPassword);
  if (!validPassword)
    return res.status(404).json({ error: "Invalid Email Id or Password" });
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.send({ authToken: token, userDetails: user });
}

async function dummyTestApi(req, res) {
  console.log("Login API done!!!");
  return res.status(200).json({ msg: "Logged In" });
}
module.exports = {
  handleUserSignup,
  handleUserLogin,
  dummyTestApi,
};
