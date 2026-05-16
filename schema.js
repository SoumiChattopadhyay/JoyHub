const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    list: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        capacity: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number(),
        category: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required()
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        // name: Joi.string().trim().min(3).max(50).required(),
        // email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required()
            .messages({
                "string.pattern.base": "Phone no. must be of 10 digits"
            }),
        eventName: Joi.string().trim().min(3).required(),
        guests: Joi.number().integer().min(1).max(Joi.ref("$capacity")).messages({ "number.max": "Guest count exceeds venue capacity" }).required(),
        startDate: Joi.date().greater("now").required(),
        endDate: Joi.date().greater("now").required(),
        startTime: Joi.string().required()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        endTime: Joi.string().required()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        requests: Joi.string().allow("", null),
        terms: Joi.boolean().valid(true).required()
    })
        .custom((value, helpers) => {
            const start = new Date(`${value.startDate}T${value.startTime}`);
            const end = new Date(`${value.endDate}T${value.endTime}`);

            if (end <= start) {
                return helpers.message("End time must be after start time");
            }

            const duration = (end - start) / (1000 * 60);
            if (duration < 60) {
                return helpers.message("Minimum booking duration is 1 hour");
            }

            return value;
        }).required()
});



// One day start time end time checking
// .custom((value, helpers) => {
//             const [sh, sm] = value.startTime.split(":").map(Number);
//             const [eh, em] = value.endTime.split(":").map(Number);
//             const start = sh * 60 + sm;
//             const end = eh * 60 + em;
//             if (end <= start) {
//                 return helpers.message("End time must be after start time");
//             }
//             const duration = end - start;
//             if (duration < 60) {
//                 return helpers.message("Minimum booking duration is 1hr");
//             }
//             return value;
//         }).required()