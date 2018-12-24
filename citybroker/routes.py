from flask import render_template, request, url_for, redirect, flash, session
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime, timedelta
import ast
import os
import json

from . import app, bcrypt
from . import utils as u
from . import models as m
from . import forms as f


@app.route("/")
def index():
    today = datetime.today()
    blog = m.blog_data.select(select_all=True)
    boc_artcls = m.boc.select(select_all=True)
    tarion_artcls = m.tarion.select(select_all=True)
    market_insights = m.insights_data.getwhere(select_column="status_area", like_column="date", query=today.strftime('%Y-%m-%d')).select()
    while len(market_insights) <= 0:
        today = today - timedelta(1)
        assert today > today - timedelta(30)
        market_insights = m.insights_data.getwhere(select_column="status_area", like_column="date", query=today.strftime('%Y-%m-%d')).select()
    market_insights = market_insights[-1]
    index_json = {
        "boc": {
            "table": boc_artcls[0][4],
            "boc1_title": boc_artcls[2][1], "boc1_link": boc_artcls[3][1], "boc1_snip": boc_artcls[4][1],
            "boc2_title": boc_artcls[2][2], "boc2_link": boc_artcls[3][2], "boc2_snip": boc_artcls[4][2],
            "boc3_title": boc_artcls[2][3], "boc3_link": boc_artcls[3][3], "boc3_snip": boc_artcls[4][3]},
        "tarion": {
            "tarion1_image": tarion_artcls[0][1], "tarion1_title": tarion_artcls[1][1], "tarion1_link": tarion_artcls[2][1],
            "tarion1_snip": tarion_artcls[3][1],
            "tarion2_image": tarion_artcls[0][2], "tarion2_title": tarion_artcls[1][2], "tarion2_link": tarion_artcls[2][2],
            "tarion2_snip": tarion_artcls[3][2],
            "tarion3_image": tarion_artcls[0][3], "tarion3_title": tarion_artcls[1][3], "tarion3_link": tarion_artcls[2][3],
            "tarion3_snip": tarion_artcls[3][3]},
        "blogs": {
            "blog1_heading": blog[0][0], "blog1_snip": blog[0][1][:150], "blog1_thumbnail": blog[0][2], "blog1_titlepic": blog[0][3],
            "blog1_link": blog[0][4],
            "blog2_heading": blog[1][0], "blog2_snip": blog[1][1][:150], "blog2_thumbnail": blog[1][2], "blog2_titlepic": blog[1][3],
            "blog2_link": blog[1][4],
            "blog3_heading": blog[2][0], "blog3_snip": blog[2][1][:150], "blog3_thumbnail": blog[2][2], "blog3_titlepic": blog[2][3],
            "blog3_link": blog[2][4]},
        "market": ast.literal_eval(market_insights[0])
    }
    return render_template("index.html", index_json=json.dumps(index_json))


@app.route("/insights")
def insights():
    graph_dates = []
    graph_city_avg = []
    graph_city_avg_dom = []
    graph_avg_lsr = []
    graph_north_avg = []
    graph_south_avg = []
    graph_east_avg = []
    graph_cdom = []
    today = datetime.today()
    yesterday = datetime.today() - timedelta(1)

    market_insights = m.insights_data.getwhere("*", "DATE", today.strftime('%Y-%m-%d')).select()
    graph_data = m.insights_data.getfrom("city_avg, city_avg_dom, avg_lsr, north_avg, south_avg, east_avg, date, time_spent_cond").select()
    graph_data = graph_data[::-1]

    for item in graph_data:
        graph_city_avg.append(item[0])
        graph_city_avg_dom.append(item[1])
        graph_avg_lsr.append(item[2])
        graph_north_avg.append(item[3])
        graph_south_avg.append(item[4])
        graph_east_avg.append(item[5])
        graph_dates.append(item[6])
        graph_cdom.append(item[7])

    graph_dates = map((lambda x: datetime.strptime(x, "%Y-%m-%d")), graph_dates)
    graph_dates = map((lambda x: x.strftime("%Y%m%d")), graph_dates)
    graph_dates = list(graph_dates)
    graph_dates_set = set(graph_dates)

    graph_index = []
    for i, date in enumerate(graph_dates_set):
        graph_index.append(graph_dates.index(date))

    graph_index = sorted(graph_index)

    while len(market_insights) == 0:
        today = today - timedelta(1)
        assert today > today - timedelta(30)
        market_insights = m.insights_data.getwhere("*", "DATE", today.strftime('%Y-%m-%d')).select()

    yday_insights_data = m.insights_data.getwhere("status_area, today_active, today_cond, today_sold",
                                                  "date", yesterday.strftime('%Y-%m-%d')).select()

    while len(yday_insights_data) == 0:
        yesterday = yesterday - timedelta(1)
        assert yesterday > yesterday - timedelta(30)
        yday_insights_data = m.insights_data.getwhere("status_area, today_active, today_cond, today_sold",
                                                      "DATE", yesterday.strftime('%Y-%m-%d')).select()

    yday_status_area, yday_active, yday_cond, yday_sold = yday_insights_data[-1]

    date, today_active, today_cond, today_sold, north_avg, south_avg, east_avg, city_avg, city_avg_dom, north_avg_dom, south_avg_dom, east_avg_dom, time_spent_cond, avg_lsr, status_area = market_insights[
        -1]

    status_area = ast.literal_eval(status_area)
    yday_status_area = ast.literal_eval(yday_status_area)
    insights_json = {
        "seven": {
            "new": int(status_area["na"]) + int(status_area["sa"]) + int(status_area["ea"]),
            "cond": int(status_area["nc"]) + int(status_area["sc"]) + int(status_area["ec"]),
            "sold": int(status_area["ns"]) + int(status_area["ss"]) + int(status_area["es"])},
        "market": {
            "time_cond": time_spent_cond,
            "avg_lsr": avg_lsr},
        "today": {
            "active": today_active,
            "cond": today_cond,
            "sold": today_sold},
        "yesterday": {
            "active": yday_active,
            "cond": yday_cond,
            "sold": yday_sold},
        "north": {
            "avg": north_avg,  # Was previously '{0:,}'.format() - now done by javascript
            "avg_dom": ast.literal_eval(north_avg_dom),
            "today": {
                "active": status_area["na"],
                "cond": status_area["nc"],
                "sold": status_area["ns"]},
            "yday": {
                "active": yday_status_area["na"],
                "sold": yday_status_area["ns"],
                "cond": yday_status_area["nc"]}},
        "south": {
            "avg": south_avg,  # Was previously '{0:,}'.format()
            "avg_dom": ast.literal_eval(south_avg_dom),
            "today": {
                "active": status_area["sa"],
                "cond": status_area["sc"],
                "sold": status_area["ss"]},
            "yday": {
                "active": yday_status_area["sa"],
                "sold": yday_status_area["ss"],
                "cond": yday_status_area["sc"]}},
        "east": {
            "avg": east_avg,  # Was previously '{0:,}'.format()
            "avg_dom": ast.literal_eval(east_avg_dom),
            "today": {
                "active": status_area["ea"],
                "cond": status_area["ec"],
                "sold": status_area["es"]},
            "yday": {
                "active": yday_status_area["ea"],
                "sold": yday_status_area["es"],
                "cond": yday_status_area["ec"]}},
        "city_avg": city_avg,  # Was previously '{0:,}'.format()
        "city_avg_dom": city_avg_dom,
        "graph": {
            "dates": sorted(graph_dates_set),
            "city_avg": [graph_city_avg[x] for x in graph_index][::-1],
            "city_avg_dom": [graph_city_avg_dom[x] for x in graph_index][::-1],
            "cond_dom": [graph_cdom[x] for x in graph_index][::-1],
            "avg_lsr": [graph_avg_lsr[x] for x in graph_index][::-1],
            "north": [graph_north_avg[x] for x in graph_index][::-1],
            "south": [graph_south_avg[x] for x in graph_index][::-1],
            "east": [graph_east_avg[x] for x in graph_index][::-1]}
    }
    return render_template("insights.html", insights_json=json.dumps(insights_json))


@app.route("/warren-john-realtor")
def warrenjohn():
    return render_template("warren.html")


@app.route("/property/<address>")
def property(address):
    listing = m.listing_info.getwhere(select_column="status, listings_dict, main_pic, all_pics", like_column="slug", query=address).select()
    listing = listing[0]
    listing_data = ast.literal_eval(listing[1])
    listing_json = {
        "address": listing_data["Address"],
        "status": listing[0],
        "data": listing_data,
        "main_pic": listing[2],
        "pics_folder": listing[3],
        "pic_names": os.listdir(os.path.join(app.config["STATIC_FOLDER"], "images", "listings", address))
    }
    listing_json = listing_json
    return render_template("listingtemplate.html", listing_json=json.dumps(listing_json))


@app.route("/blog/<title>")
def blog(title):
    blog_info = m.blog_data.select(select_all=True)
    blog_json = dict()
    blog_json["other"] = dict()
    for index, blog in enumerate(blog_info):
        if blog[4] == title:
            for a, item in enumerate(blog):
                blog_json[m.blog_data.column_names[a]] = item
        else:
            blog_json["other"]["blog"+str(index)] = dict()
            for b, item in enumerate(blog):
                blog_json["other"]["blog"+str(index)][m.blog_data.column_names[b]] = item

    blog_json = blog_json
    return render_template("blog.html", blog_json=json.dumps(blog_json))


@app.route("/robots.txt")
def robots():
    return ("User-Agent: * \nAllow: /")


@app.route("/ourwork")
def ourwork():
    all_listings = m.listing_info.getfrom("slug, status, main_pic").select()
    return render_template("ourwork.html", all_listings=json.dumps(all_listings))


# Lead Forms
@app.route("/areas", methods=["GET", "POST"])
def buyers():
    if f.buyersForm.isvalid():
        f.send_buyersForm()
        return redirect(url_for("search"))
    return render_template("buyers.html")


@app.route("/sellers", methods=["GET", "POST"])
def sellers():
    if f.sellersForm.isvalid():
        f.send_sellersForm()
        return redirect(url_for("search"))
    return render_template("sellers.html")
# end lead forms


@app.route("/search")
def search():
    return render_template("propertysearch.html")


@app.route("/tools", methods=["GET", "POST"])
def tools():
    return render_template("tools.html")


@app.route("/zoning", methods=["GET", "POST"])
def zoning():
    if request.method == "POST":
        linkG = list()
        linkP = list()
        linkR = list()
        linkS = list()
        query = request.form["zsearch"]
        query = "%"+query+"%"
        general = m.zoning_info.getlike("section", "general", query).select()
        u.make_link(linkG, general)
        permit = m.zoning_info.getlike("section", "permitted", query).select()
        u.make_link(linkP, permit)
        reg = m.zoning_info.getlike("section", "regulations", query).select()
        u.make_link(linkR, reg)
        special = m.zoning_info.getlike("section", "special", query).select()
        u.make_link(linkS, special)
        definition = m.definitions_zoning.getlike("Definition", "Definition", query).select()
        return render_template("zoning.html",
                               general=general, linkG=linkG,
                               permit=permit, linkP=linkP,
                               reg=reg, linkR=linkR,
                               special=special, linkS=linkS,
                               definition=definition)
    return render_template("zoning.html")


# PRIVATE
@app.route("/cbagent", methods=["GET", "POST"])
def login():
    session["next"] = request.args.get("next")
    if request.method == "POST":
        user_data = m.login_data.getwhere("*", "username", request.form["user"]).select()
        if bool(user_data):
            user_data = user_data[0]
            # 0: employeenum | 1: admin | 2: username | 3: password
            user = m.User(user_data[0])
            if user.employed() and user_data[2] == request.form["user"] and bcrypt.check_password_hash(user_data[3], request.form["password"]):
                login_user(user)
                if "next" in session:
                    next = session["next"]
                    if u.is_safe_url(next):
                        return redirect(url_for("agenthome"))
            else:
                flash("Login credentials invalid")
        else:
            flash("Login credentials invalid")
    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


@app.route("/changepassword", methods=["GET", "POST"])
@login_required
def changepassword():
    user_data = m.login_data.getwhere("password", "employeenum", current_user.id).select()
    known_current_pw = user_data[0][0]
    if request.method == "POST":
        if f.changePasswordForm.isvalid(checktamper=True) and bcrypt.check_password_hash(known_current_pw, request.form["current"]) \
                and request.form["newpassword"] == request.form["confirmpassword"]:
            pw_hash = bcrypt.generate_password_hash(request.form["confirmpassword"]).decode("utf-8")
            m.login_data.update({"password": pw_hash}, {"employeenum": current_user.id}).commit()
            flash("Password updated")
            return redirect(url_for("agenthome"))
        else:
            flash("Form invalid")
    return render_template("changepassword.html")


@app.route("/newagent", methods=["GET", "POST"])
@login_required
def newagent():
    if request.method == "POST":
        if f.newAgentForm.isvalid(checktamper=True):
            m.register_user()
            flash("New Agent added")
            return redirect(url_for("agenthome"))
        else:
            flash("Form invalid")
            return redirect(url_for("agenthome"))
    return render_template("employeeinput.html")


@app.route("/tradeinput", methods=["GET", "POST"])
@login_required
def trade_input():
    # Add admin ability to input for other agent
    today = datetime.today()
    trade_num = len(m.trades.getfrom("tradenum").select()) + 1
    user_json = {
        "user": current_user.__dict__,
        "info": [trade_num, today.strftime('%Y-%m-%d')]
    }
    if request.method == "POST":
        if f.tradeInputForm.isvalid(checktamper=True):
            m.input_trade(current_user.id, trade_num)
            # TODO Will need to validate if trade is being added on behalf of someone(by admin), or by the person themselves in the future
            flash("Trade Inputted Successfully")
            return redirect(url_for("agenthome"))
        else:
            flash("Form invalid")
            return redirect(url_for("agenthome"))
    return render_template("tradeinput.html", user_json=json.dumps(user_json))


@app.route("/listinginput", methods=["GET", "POST"])
@login_required
def listing_input():
    # TODO need to handle input on the same MLS # twice - reject the 2nd
    if request.method == "POST":
        if f.listingInputForm.isvalid(checktamper=True):
            m.add_listing(*u._handle_listing_upload())
            return redirect(url_for("agenthome"))
        else:
            flash("Form invalid")
            return redirect(url_for("agenthome"))
    return render_template("listinginput.html",)


@app.route("/agenthome", methods=["GET", "POST"])
@login_required
def agenthome():
    if current_user.admin:
        trades_data = m.trades.getfrom("address, mls, tradenum, status").select()
    else:
        trades_data = m.trades.getwhere("address, mls, tradenum, status", "employeenum", current_user.id).select()
    trades_data = [list(value) for value in trades_data]
    trade_nums = {int(trade[2]) for trade in trades_data}
    form_names = {"trade_record", "modify_trade", "upload_documents"}
    user_json = {
        "user": current_user.__dict__,
        "trades": trades_data[::-1]
    }
    if request.method == "POST":
        for form_url, trade in request.form.items():
            if form_url in form_names and int(trade) in trade_nums:
                selected_trade = m.Trade(trade)
                url_switch = {
                    "trade_record": selected_trade.financial(),
                    "modify_trade": selected_trade,
                    "upload_documents": selected_trade
                }
                url_switch[form_url]
                trade_json = selected_trade.__dict__
                trade_json["user"] = current_user.__dict__
                session["trade"] = trade_json
                return redirect(url_for(form_url))

        else:
            flash("Validation failed. Email sent to admin and broker of record.")
            return redirect(url_for("agenthome"))

        return redirect(url_for("agenthome"))
    return render_template("agenthome.html", user_json=json.dumps(user_json))


@app.route("/modifytrade", methods=["GET", "POST"])
@login_required
def modify_trade():
    if request.method == "POST":
        if f.modifyTradeForm.isvalid(checktamper=True):
            session["trade"]["referralout"] = u.sort_dynamics(request.form, "outsideref", "referralout", session["trade"]["referralout"])
            session["trade"]["referralin"] = u.sort_dynamics(request.form, "insideref", "referralin", session["trade"]["referralin"])
            u.remove_dynamics(session["trade"])
            m.update_trade(session["trade"])
            flash("Trade updated successfully.")
            return redirect(url_for("agenthome"))
        else:
            flash("Validation failed. Email sent to admin and broker of record.")
            return redirect(url_for("agenthome"))
    return render_template("modifytrade.html", trade_json=json.dumps(session["trade"]))


@app.route("/traderecord")
@login_required
def trade_record():
    return render_template("traderecord.html", trade_json=json.dumps(session["trade"]))


@app.route("/upload", methods=["GET", "POST"])
@login_required
def upload_documents():
    if request.method == "POST":
        if f.uploadDocumentsForm.isvalid(checktamper=True):
            u.complex_email_content(*u.handle_uploads(session["trade"]))
            flash("Documents uploaded.")
            return redirect(url_for("agenthome"))
        else:
            flash("Validation failed. Email sent to admin and broker of record.")
    return render_template("upload.html", trade_json=json.dumps(session["trade"]))
