var fs = require('fs');

var setting = require('../config/setting');
var User = require('../models/users');

exports.index = (req, res) => {
    res.io.sockets.on('connection', (socket) => {
        socket.on('/get_today_new_user', (data) => {
            User.todayNewUser((err, doc) => {
                if (err) {
                    socket.emit('/return_today_new_user', []);
                }

                User.updateTodayNewUser((err, rst)=> {
                    if (err) {
                        socket.emit('/return_today_new_user', []);
                    }

                    socket.emit('/return_today_new_user', doc);
                });
            });
        });
    });

    res.render('index', {
        mapkey: setting.mapkey
    });
};

exports.todayUserList = (req, res) => {
    User.todayList((err, doc) => {
        if (err) {
            res.json([]);
        }

        User.updateTodayList((err, rst)=> {
            if (err) {
                res.json([]);
            }

            res.json(doc);
        });
    });
};