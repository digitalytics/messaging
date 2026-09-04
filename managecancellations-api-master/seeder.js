const mongoose = require('mongoose');
const config = require("./config");
const { encrypt } = require("./utils/common");
const User = require('./models/admin');
const Role = require('./models/role');
const Access = require('./models/accessRight');

// Function to seed admin user
const seedAdminUser = async () => {
    try {
        const roleData = {
            title: 'Admin'
        }
        let existingRole = await Role.findOne({ title: roleData?.title });
        if (existingRole) {
            console.log('Role already exists.');
        } else {
            existingRole = new Role(roleData);
            await existingRole.save();
        }

        const accessData = {
            roleID: existingRole?._id,
            accessData: [{
                "title": "Admin",
                "code": "admin",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }, {
                "title": "Dashboard",
                "code": "dashboard",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }, {
                "title": "Role",
                "code": "role",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }, {
                "title": "Permission",
                "code": "permission",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }, {
                "title": "Waiting List",
                "code": "waitingList",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }, {
                "title": "Notification",
                "code": "notification",
                "data": {
                    "is_view": true,
                    "is_edit": true,
                    "is_delete": true,
                    "is_add": true
                }
            }]
        }
        let existingAccess = await Access.findOne({ roleID: existingRole?._id });
        if (existingAccess) {
            console.log('Access Right already exists.');
        } else {
            existingAccess = new Access(accessData);
            await existingAccess.save();
        }
        console.log(existingAccess);

        const userData = {
            name: 'admin',
            email: 'admin@ehr.com',
            roleId: existingRole?._id,
            password: await encrypt("abcABC@123")
        }
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: userData?.email });

        // If admin user already exists, return
        if (existingAdmin) {
            console.log('Admin user already exists.');
            const admin = await User.findOneAndUpdate({
                email: userData?.email
            }, {
                roleId: existingRole?._id
            }, { new: true });
            await admin.save();
        } else {
            const admin = new User(userData);
            await admin.save();
        }

        // Create a new admin user
        console.log('Admin user seeded successfully.');
    } catch (err) {
        console.error('Error seeding admin user:', err);
    } finally {
        // Close MongoDB connection
        mongoose.connection.close();
        // Exit the process
        process.exit(0);
    }
};

// Connect to MongoDB
mongoose.connect(config?.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected.');
        // Call the seedAdminUser function after connecting to MongoDB
        seedAdminUser();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Exit the process with an error code
        process.exit(1);
    });