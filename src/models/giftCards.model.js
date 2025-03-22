import mongoose, { Schema } from "mongoose";

const giftCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    occasion: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    recipientPhone: {
        type: Number,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
    },
    validUpto: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    },
    
    productCategory: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Categories"
    },
    productDescription: {
        type: String,
        default: ""
    },
    weight: {
        number: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            enum: [ "Kg", "g" ]
        }
    },
    dimensions: {
        l: {
            type: Number,
            required: true,
        },
        b: {
            type: Number,
            required: true,
        },
        h: {
            type: Number,
            required: true,
        }
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    vegetarian: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantitySold: {
        type: Number,
        default: 0
    },
    imageUrl: [
        {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

export const GiftCard = mongoose.model("GiftCard", giftCardSchema);