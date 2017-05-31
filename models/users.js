var mongoose = require('mongoose');
var moment = require('moment');

var userSchema = new mongoose.Schema({
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    createTime: {
        type: Date
    },
    haveRead: {
        type: Boolean,
        default: false
    }
}, {collection: 'user'});

userSchema.statics.todayList = function (cb) {
    var start = moment().startOf('day');
    var end = moment().endOf('day');

    return this.find({createTime: {$gte: start, $lt: end}})
        .sort({createTime: 1})
        .select('lat lng')
        .exec(cb);
};

userSchema.statics.updateTodayList = function (cb) {
    var start = moment().startOf('day');
    var end = moment().endOf('day');

    this.update({createTime: {$gte: start, $lt: end}}, {
            '$set': {
                haveRead: true
            }
        }, {multi: true})
        .exec(cb);
};

userSchema.statics.todayNewUser = function (cb) {
    var start = moment().startOf('day');
    var end = moment().endOf('day');

    return this.find({createTime: {$gte: start, $lt: end}, haveRead: false})
        .sort({createTime: 1})
        .select('lat lng')
        .exec(cb);
};

userSchema.statics.updateTodayNewUser = function (cb) {
    var start = moment().startOf('day');
    var end = moment().endOf('day');

    this.update({createTime: {$gte: start, $lt: end}, haveRead: false}, {
            '$set': {
                haveRead: true
            }
        }, {multi: true})
        .exec(cb);
};

module.exports = mongoose.model('User', userSchema);