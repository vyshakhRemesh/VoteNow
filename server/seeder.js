const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.log(err));

// Sample users to insert
const seedUsers = async () => {
  try {
    await User.deleteMany(); // clears existing users (optional)

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const hashedStudentPassword = await bcrypt.hash("student123", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@college.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Student One",
        email: "student1@college.com",
        password: hashedStudentPassword,
        role: "student",
      },
      {
        name: "Student Two",
        email: "student2@college.com",
        password: hashedStudentPassword,
        role: "student",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
