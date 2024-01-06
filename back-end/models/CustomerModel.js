import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Customers = db.define('customers',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    // email: {
    //     type: DataTypes.STRING(255),
    //     allowNull: true,
    //     validate: {
    //         notEmpty: true,
    //     },
    // },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    }
},{
    freezeTableName: true
});

export default Customers;
