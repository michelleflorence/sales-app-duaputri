import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Orders from "./OrderModel.js";
import Products from "./ProductModel.js";

const OrderDetails = db.define('order_details',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    orderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    price:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    totalPrice:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Orders.hasMany(OrderDetails);
OrderDetails.belongsTo(Orders, {foreignKey: 'orderId'});

Products.hasMany(OrderDetails);
OrderDetails.belongsTo(Products, {foreignKey: 'productId'});

export default OrderDetails;
