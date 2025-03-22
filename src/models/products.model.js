import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: "Category"
    },
    subCategories: [
        {
            type: Schema.Types.ObjectId,
            // required: true,
            ref: "SubCategories"
        },
    ],
    collections: [
        {
            type: Schema.Types.ObjectId,
            // required: true,
            ref: "Collections"
        }
    ],
    goldWeight: {
        type: Number,
        required: true,
    },
    diamondWeight: {
        type: Number,
        required: true
    },
    netWeight: {
        type: Number,
        // required: true
    },
    solitareWeight: {
        type: Number,
        // required: true
    },
    grossWeight: {
        type: Number,
        // required: true
    },
    noOfSolitares: {
        type: Number,
        // required: true
    },
    noOfMultiDiamonds: {
        type: Number,
        // required: true
    },
    multiDiamondWeight: {
        type: Number,
        required: true
    },
    totalKarats: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: [ "Men", "Women", "neutral" ]
    },
    goldColor: [
        {
            type: String,
            required: true,
            // enum: ["White", "Rose" , "Yellow"]
        }
    ],
    shapeOfSolitare: {
        type: String,
        // required: true,
    },
    shapeOfMultiDiamonds: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        // required: true,
        default: 0
    },
    price: {
        type: Number,
        // required: true,
    },
    quantitySold: {
        type: Number,
        default: 0
    },
    diaPointers :{
        type: Number,
    },
    imageUrl: [
        {
            url: {
                type: String,
                // required: true
            },
            publicId: {
                type: String,
                // required: true
            }
        }
    ]
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);