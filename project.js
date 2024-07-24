var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
var nodemailer = require("nodemailer");


let app = express();



app.listen(2020, function (req, resp) {
    console.log("server started :-)");
})

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kkashishggarg123@gmail.com",
        pass: "rsahzzprbrycnlts"
    }
});

app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileuploader());


// let config = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "Diya@123*",
//     database: "project",
//     dateStrings: true

// }

let config = {
    host: "bfwvz5bt1fnedr0r0vxo-mysql.services.clever-cloud.com",
    user: "ucyoiwzl1glq8anc",
    password: "VNzmJfYSZqQ4IfiFnGr9",
    database: "bfwvz5bt1fnedr0r0vxo",
    dateStrings: true,
    keepAliveInitialDelay:10000,
    enableKeepAlive:true,

}
var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("connected to database successfullyy");
    else
        console.log(err.message);

})



app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})


//sending email on forgot pwd
app.get("/forgot-password", function (req, resp) {
    let nodemailer = req.query.txtEmaill;
    let txtEmaill=req.query.txtEmaill;
    mysql.query("select * from  users where email=? ", [nodemailer,txtEmaill], function (err, result) {

        if (err) {
            resp.send(err.message);
        }
        else {
            if (result.length == 0) {
                resp.send("Invalid Email ID");
            }
            else if (result.length == 1) {

                var mailOptions = {
                    from: "kkashishggarg123@gmail.com",
                    to: nodemailer,
                    subject: " node js mail testing",
                    text: result[0].pwd
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        resp.send(err.message)

                    } else {

                        console.log('Email sent: ' + info.response);
                        resp.send("email sent");
                    }
                })

            }
        }
    })
})

app.get("/signup-process", function (req, resp) {
    console.log(req.query);

    let email = req.query.txtEmail;
    let pwd = req.query.txtPwd;
    let utype = req.query.combo;



    mysql.query("insert into users values(?,?,?,1)", [email, pwd, utype], function (err) {
        if (err == null)
            resp.send("congo");
        else
            resp.send(err.message);
    })
})

app.get("/login-process", function (req, resp) {
    let txtEmaill = req.query.txtEmaill;
    let txtpwd = req.query.txtpwd;

    mysql.query("select * from users where email=? and pwd=?", [txtEmaill, txtpwd], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        if (result.length == 0) {
            resp.send("invalid id or password");
            return;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype);
            return;
        }
        else {
            resp.send("you are blocked!!!");
            return;
        }
    })
})
app.get("/openinfl", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
})

app.get("/openclient", function (req, resp) {
    let path = __dirname + "/public/client-dash.html";
    resp.sendFile(path);
})

app.get("/openclient", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})

app.get("/openadmin", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})

app.get("/openinflu", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
})

app.get("/open-client-profile", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})

app.get("/open-inf-profile", function (req, resp) {
    let path = __dirname + "/public/infl-profile.html";
    resp.sendFile(path);
})

app.get("/open-event-manager", function (req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
})


app.post("/save-process", function (req, resp) {
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else
        fileName = "nopic.jpg";

    let ary = req.body.ifield;

    let str;
    if (Array.isArray(ary)) {
        str = "";
        for (i = 0; i < ary.length; i++) {
            str += ary[i] + ",";
        }
        console.log(str);
    }
    else
        str = ary;

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.iemail, req.body.iname, req.body.icombo, req.body.idob, req.body.iadd, req.body.icity, req.body.icon, str, req.body.insta, req.body.iface, req.body.iyou, req.body.info, fileName], function (err) {
        if (err == null)
            resp.send("Bahut Bahut Badhai.....");
        else
            resp.send(err.message);
    })
})

app.post("/save-client-profile", function (req, resp) {

    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [req.body.cemail, req.body.cname, req.body.ccity, req.body.cstate, req.body.indvi, req.body.cont], function (err) {
        if (err == null)
            resp.send("Bahut Bahut Badhai.....");
        else
            resp.send(err.message);
    })
})

app.get("/event-process", function (req, resp) {
    console.log(req.query);

    let EMAIL = req.query.bemail;
    let TITLE = req.query.btitle;
    let DOB = req.query.bdob;
    let TIME = req.query.btime;
    let CITY = req.query.bcity;
    let VENUE = req.query.bvenue;

    mysql.query("insert into even values(null,?,?,?,?,?,?)", [EMAIL, TITLE, DOB, TIME, CITY, VENUE], function (err) {
        if (err == null)
            resp.send("congo");
        else
            resp.send(err.message);
    })

    app.post("/profile-update", function (req, resp) {

        let fileName = "";
        if (req.files != null) {
            fileName = req.files.ppic.name;
            let path = __dirname + "/public/uploads/" + fileName;
            req.files.ppic.mv(path);
        }
        else {
            fileName = req.body.hdn;
        }


        mysql.query("update iprofile set iname=?, gender=? , dob=?,address=?,city=?,contact=?,fields=?,insta=?,fb=?,youtube=?,other=?,picpath=? where emailid=?", [req.body.iname, req.body.icombo, req.body.idob, req.body.iadd, req.body.icity, req.body.icon, req.body.ifield, req.body.insta, req.body.iface, req.body.iyou, req.body.info, fileName, req.body.iemail], function (err, result) {
            if (err == null) {
                if (result.affectedRows >= 1)
                    resp.send("Updated  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
            }
            else
                resp.send(err.message);
        })

    })

})

app.post("/client-profile-update", function (req, resp) {

    mysql.query("update cprofile set name=?, city=?,state=?,org=?,contact=? where email=?", [req.body.cname, req.body.ccity, req.body.cstate, req.body.indvi, req.body.cont, req.body.cemail], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1)
                resp.send("Updated  Successfulllyyyy....");
            else
                resp.send("Invalid Email ID");
        }
        else
            resp.send(err.message);
    })

})



app.get("/find-user-details", function (req, resp) {
    let emaill = req.query.iemail;

    mysql.query("select * from iprofile where emailid=?", [emaill], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })

})
app.get("/find-client-details", function (req, resp) {

    let cemail = req.query.cemail;

    mysql.query("select * from cprofile where email=?", [cemail], function (err, resultJsonAry) {

        if (err != null) {
            resp.send(err.message);
            return;

        }
        //console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })

})



app.get("/settings-update", function (req, resp) {
    console.log(req.query);
    var scon = req.query.scon;
    var semail = req.query.semail;
    var old = req.query.old;
    var snew = req.query.snew;

    mysql.query("select * from users where email=? and pwd=?", [semail, old], function (err, result) {
        if (result) {
            mysql.query("update users set pwd=? where email=?", [snew, semail], function (err, result) {
                if (err != null)
                    resp.send("updated");
                else
                    resp.send(err);
            })
        }
        else
            resp.send("wrong password");
    })

})

app.get("/settings-update-client", function (req, resp) {
    console.log(req.query);
    var ccon = req.query.ccon;
    var cemail = req.query.cemail;
    var cold = req.query.cold;
    var cnew = req.query.cnew;

    mysql.query("select * from users where email=? and pwd=?", [cemail, cold], function (err, result) {
        if (result) {
            mysql.query("update users set pwd=? where email=?", [cnew, cemail], function (err, result) {
                if (err != null)
                    resp.send("updated");
                else
                    resp.send(err);
            })
        }
        else
            resp.send("wrong password");
    })

})

app.get("/open-admin-users", function (req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
})


app.get("/open-admin-influ", function (req, resp) {
    let path = __dirname + "/public/admin-all-infu.html";
    resp.sendFile(path);
})



app.get("/fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})


app.get("/fetch-events", function (req, resp) {
    mysql.query("select * from even where doe>=current_date()", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})

app.get("/del-one", function (req, resp) {
    mysql.query("delete from even where rid=?", [req.query.rid], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("Deleted");

    })

})



app.get("/fetch-profile", function (req, resp) {
    mysql.query("select * from iprofile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})

app.get("/del-one", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("Deleted");

    })

})

app.get("/res-one", function (req, resp) {
    mysql.query("update users set status=? where email=?", [1, req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("resumed");

    })

})

app.get("/bol-one", function (req, resp) {
    mysql.query("update users set status=? where email=?", [0, req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("blocked");

    })

})

app.get("/find-influ", function (req, resp) {

    //console.log("lol");
    //console.log(req.query.fields);

    mysql.query("select * from iprofile where fields like ?", ["%" + req.query.fields + "%"], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})


app.get("/do-find", function (req, resp) {

    //console.log("lol");
    //console.log(req.query.fields);

    mysql.query("select * from iprofile where fields like ? && city = ? ", ["%" + req.query.fields + "%", req.query.city], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})

app.get("/do-findbyiname", function (req, resp) {

    mysql.query("select * from iprofile where iname=?", [req.query.iname], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})

app.get("/check-client-acc", function (req, resp) {
    let cemail = req.query.cemail;
    mysql.query("select * from cprofile where email = ?", [cemail], function (err, result) {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(result);
        }
    })
})

app.get("/check-influ-acc", function (req, resp) {
    let iemail = req.query.iemail;
    mysql.query("select * from iprofile where emailid = ?", [iemail], function (err, result) {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(result);
        }
    })
})
