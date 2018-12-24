# Handles database i/o
from flask import request
from . import app, bcrypt, login_manager
from . import simplesql3 as ss3
from . import utils as u
from datetime import datetime
import json
import ast
from flask_login import UserMixin

# Public Tables
blog_data = ss3.simplesql3(database_name=app.config["BLOGS_DATABASE"], table_name="blogs")
boc = ss3.simplesql3(database_name=app.config["ARTICLES_DATABASE"], table_name="boc")
tarion = ss3.simplesql3(database_name=app.config["ARTICLES_DATABASE"], table_name="tarion")
insights_data = ss3.simplesql3(database_name=app.config["MLSMAJ_DATABASE"], table_name="insights")
listing_info = ss3.simplesql3(database_name=app.config["LISTINGS_DATABASE"], table_name="listings")

# Zoning Tables
zoning_info = ss3.simplesql3(database_name=app.config["ZONING_DATABASE"], table_name="zoning")
definitions_zoning = ss3.simplesql3(database_name=app.config["ZONING_DATABASE"], table_name="definitions")

# Private Tables
employees = ss3.simplesql3(database_name=app.config["CB_DATABASE"], table_name="employee")
login_data = ss3.simplesql3(database_name=app.config["CB_DATABASE"], table_name="login")
trades = ss3.simplesql3(database_name=app.config["CB_DATABASE"], table_name="trades")


@login_manager.user_loader
def load_user(user_id):
    return User.get_user(int(user_id))


class User(UserMixin):
    def __init__(self, data):
        usr_login = login_data.getwhere("*", "employeenum", data).select()[0]
        user_info = employees.getwhere("*", "employeenum", usr_login[0]).select()[0]
        if usr_login[1] == "yes":
            self.admin = True
        else:
            self.admin = False
        self.id = int(usr_login[0])
        self.type = user_info[1]
        self.email = user_info[7]
        self.reco = user_info[8]
        self.phone = user_info[5]
        self.commplan = user_info[9]
        self.hst = user_info[10]
        self.first = user_info[3]
        self.last = user_info[4]
        self.status = user_info[11]

    def employed(self):
        if self.status == "employed":
            return True
        else:
            return False

    @staticmethod
    def get_user(user_id):
        data = login_data.getwhere("employeenum", "employeenum", user_id).select()
        if bool(data):
            return User(user_id)
        else:
            return None

    def __str__(self):
        return f"""
                \n
                Admin {self.admin}
                ID {self.id}
                Type {self.type}
                Email {self.email}
                RECO # {self.reco}
                Phone {self.phone}
                Commission plan {self.commplan}
                HST # {self.hst}
                First Name {self.first}
                Last Name {self.last}
                Status {self.status}
                \n
                """

    def __repr__(self):
        return f"""
                \n
                .admin {self.admin}
                .id {self.id}
                .type {self.type}
                .email {self.email}
                .reco {self.reco}
                .phone {self.phone}
                .commplan {self.commplan}
                .hsr {self.hst}
                .first {self.first}
                .last {self.last}
                .status {self.status}
                \n
                """


class Trade():
    HST = 0.13

    def __init__(self, trade_number):
        trade_data = trades.getwhere("tradeinfo", "tradenum", trade_number).select()
        self.trade = ast.literal_eval(trade_data[0][0])
        self.trade["tradenum"] = trade_number

    def financial(self):
        """
        ***I have redacted most of the code for the financial calculations, it is not complicated but I do not want to open source that part.***
        """

        for k, v in self.trade.items():
            if "phone" in k:
                pass
            else:
                try:
                    self.trade[k] = int(v)
                except ValueError:
                    pass

        # Sorting the referrals and extra conditions into their own area
        # # Referralin is a referral within the company, not an incoming one.

        self.referralout = dict()
        self.referralin = dict()
        self.conditionsother = dict()
        self.rebates = {
            "buyer": {},
            "seller": {}
        }
        # These are declared here to allow for rebates to be calculated easily
        self.buyer_subtotal = int()
        self.listing_subtotal = int()
        self.buyerseller_subtotal = int()

        # Just sorting the referrals
        self.referralout = u.sort_dynamics(self.trade, "outsideref", "referralout", self.referralout)
        self.referralin = u.sort_dynamics(self.trade, "insideref", "referralin", self.referralin)
        self.conditionsother = u.sort_dynamics(self.trade, "othercond", "conditionsother", self.conditionsother)

        # Tallying up the total commissions

        # Removing rebates from commissions
        BCOMM_BASE = self.buyer_subtotal
        LCOMM_BASE = self.listing_subtotal
        BS_BASE = self.subtotal

        # Factoring in referrals and extra conditions - if any
        if self.referralin:
            if self.trade["endtype"] == "buyer":
                self.referralin, self.buyer_subtotal, self.buyerhst = u.getreferral(
                    self.referralin, self.buyer_subtotal, self.buyerhst, BCOMM_BASE, self.HST)

            elif self.trade["endtype"] == "seller":
                self.referralin, self.listing_subtotal, self.listinghst = u.getreferral(
                    self.referralin, self.listing_subtotal, self.listinghst, LCOMM_BASE, self.HST)

            elif self.trade["endtype"] == "buyerseller":
                self.referralin, self.buyerseller_subtotal, self.buyerseller_hst = u.getreferral(
                    self.referralin, self.buyerseller_subtotal, self.buyerseller_hst, BS_BASE, self.HST)
        if self.referralout:
            if self.trade["endtype"] == "buyer":
                self.referralout, self.buyer_subtotal, self.buyerhst = u.getreferral(
                    self.referralout, self.buyer_subtotal, self.buyerhst, BCOMM_BASE, self.HST)

            elif self.trade["endtype"] == "seller":
                self.referralout, self.listing_subtotal, self.listinghst = u.getreferral(
                    self.referralout, self.listing_subtotal, self.listinghst, LCOMM_BASE, self.HST)

            elif self.trade["endtype"] == "buyerseller":
                self.referralout, self.buyerseller_subtotal, self.buyerseller_hst = u.getreferral(
                    self.referralout, self.buyerseller_subtotal, self.buyerseller_hst, BS_BASE, self.HST)

        self.buyertotal = self.buyer_subtotal + self.buyerhst
        self.listingtotal = self.listing_subtotal + self.listinghst
        self.buyerseller_total = self.buyerseller_subtotal + self.buyerseller_hst

    def __str__(self):
        return self.trade

    def __repr__(self):
        return self.trade


def input_trade(employeenum, trade_num):
    today = datetime.today()
    trade_data = dict(request.form)
    trade_data["entrydate"] = today.strftime('%Y-%m-%d')
    if trade_data["status"][0] == "firm":
        # If trade inputted as firm (never had any conditions), it can only have been firm the day it was accepted
        trade_data["firmdate"] = trade_data["acceptancedate"]
    for k, v in trade_data.items():
        trade_data[k] = "".join(v)
    trades.insert(
        str(trade_num),
        str(employeenum),
        trade_data["mls"],
        trade_data["address"],
        trade_data["saleprice"],
        trade_data["acceptancedate"],
        trade_data["closedate"],
        trade_data["endtype"],
        trade_data["status"],
        trade_data["transactiontype"],
        json.dumps(trade_data))


def update_trade(trade_data):
    col_names = set(trades.column_names)
    for k, v in request.form.items():
        if k in col_names:
            trades.update({k: v}, {"tradenum": trade_data["trade"]["tradenum"]}).commit()
            trade_data["trade"][k] = v
        else:
            trade_data["trade"][k] = v
    trades.update({"tradeinfo": json.dumps(trade_data["trade"])}, {"tradenum": trade_data["trade"]["tradenum"]}).commit()


def register_user():
    pw_hash = bcrypt.generate_password_hash(request.form["password"]).decode("utf-8")
    employee_num = employees.getfrom("employeenum").select()[0][-1] + 1
    employees.insert(
        employee_num,
        request.form["position"],
        request.form["datejoined"],
        request.form["firstname"],
        request.form["lastname"],
        request.form["phone"],
        request.form["personalemail"],
        request.form["workemail"],
        request.form["reconum"],
        request.form["commplan"],
        request.form["hstnum"],
        "employed")
    login_data.insert(
        employee_num,
        request.form["admin"],
        request.form["workemail"],
        pw_hash)


@u.async
def add_listing(slug, listing, main_pic, folder):
    listing_info.insert(
        slug,
        listing["Status"].upper(),
        json.dumps(listing),
        main_pic,
        folder
    )
