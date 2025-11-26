
require("dotenv").config();
const configurations = {
    ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRING_MONGODB
    },
    Authentication: {
        GitHub: {
            ClientID: process.env.GITHUB_CLIENT_ID,
            ClientSecret: process.env.GITHUB_CLIENT_SECRET
        }
    }
}
module.exports = configurations;