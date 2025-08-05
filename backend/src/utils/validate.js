import Joi from "joi";

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required().messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must be at most 30 characters long',
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must be at most 30 characters long',
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),

})

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
})


const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .messages({
            'string.min': 'New password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
            'string.empty': 'New password is required',
            'any.required': 'New password is required'
        }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm password must match new password',
        'string.empty': 'Confirm password is required',
        'any.required': 'Confirm password is required'
    })
});
const createPostSchema = Joi.object({
    content: Joi.string().min(1).max(500).required().messages({
        'string.min': 'Content must be at least 1 character long',
        'string.max': 'Content must be at most 500 characters long',
        'string.empty': 'Content is required',
        'any.required': 'Content is required'
    }),


});


export { createPostSchema, loginSchema, registerSchema, changePasswordSchema }