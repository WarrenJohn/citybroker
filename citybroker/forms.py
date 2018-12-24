# Handles all the forms for the app
from flask import request
import requests

from . import app
from . import utils as u


class ValidateForm():
    """Used a class to validate the forms to allow instantiation of all form validator objects at once with the same variables
    (control_data, to_validate, etc..).
    """

    def __init__(self, validate_these, *validation_data):
        self.validate = validate_these
        self.control = validation_data

    def isvalid(self, checktamper=False):
        """request.form sends the data in the form of an ImmutableDict

        checktamper is used to check form elements like the names
        Some functions input JSON directly to the DB and use form elements
        as the keys.

        self.notvalid list is used to persist the invalid data to allow for use
        later on if desired
        """
        received = request.form
        self.notvalid = list()
        if checktamper:
            received = request.form
            for field, value in received.items():
                if field in self.control:
                    continue
                else:
                    check = "".join([i for i in field if not i.isdigit()])
                    if check in self.control:
                        continue
                    else:
                        self.notvalid.append(check)
                        # print(self.notvalid)
                        return False
            return True
        else:
            if bool(received):
                for field, value in received.items():
                    if field in self.validate:
                        for control in self.control:
                            if value in control:
                                break
                        else:
                            self.notvalid.append((field, value))
                if bool(self.notvalid):
                    # print(self.notvalid)
                    return False
                else:
                    return True

    def __repr__(self):
        return (self.validate, self.control)

    def __str__(self):
        return (f"Fields to be validated: {self.validate}\n Data that should be received {self.control}")


def send_buyersForm():
    leadinfo = f"""
    First: {request.form["firstname"]},
    Last: {request.form["lastname"]},
    Phone: {request.form["phonenumber"]}
    Email: {request.form["email"]},
    Address: {request.form["streetaddress"]}, {request.form["city"]}
    ------
    Buying/Selling: {request.form["buysell"]}
    Area: {request.form["areas"]}
    Price Range: ${request.form["minprice"]} - ${request.form["maxprice"]}
    Property Type: {request.form["propertytype"]}
    Beds: {request.form["bedrooms"]}
    Baths: {request.form["bathrooms"]}
    Receive email updates: {request.form["emailupdates"]}
    """
    requests.post(app.config["MAILGUN_BUYERS_LIST"],
                  auth=("api", app.config["MAILGUN_API_KEY"]),
                  data={
                      "address": request.form["email"],
                      "name": f'{request.form["firstname"]} {request.form["lastname"]}',
                      "subscribed": True,
                      "description": "BUYER Website Lead"
    }
    )
    u.send_simple_message(app.config["MAILGUN_LEADS_BASELINK"], "Leads - citybroker <leads@test.ca>",
                          "Warren John <warren@test.ca>", "NEW BUYER LEAD", "", leadinfo)


def send_sellersForm():
    leadinfo = f"""
    First: {request.form["firstname"]},
    Last: {request.form["lastname"]},
    Phone: {request.form["phonenumber"]}
    Email: {request.form["email"]},
    Address: {request.form["Address"]}, {request.form["City"]}
    Beds: {request.form["bedrooms"]}
    Baths: {request.form["bathrooms"]}
    Property Type: {request.form["typeofhome"]}
    Resident status: {request.form["residentstatus"]}
    Relationship: {request.form["relationship"]}
    Planning on selling: {request.form["planningtosell"]}
    Listing status: {request.form["listingstatus"]}
    """
    requests.post(app.config["MAILGUN_SELLERS_LIST"],
                  auth=("api", app.config["MAILGUN_API_KEY"]),
                  data={
                      "address": request.form["email"],
                      "name": f'{request.form["firstname"]} {request.form["lastname"]}',
                      "subscribed": True,
                      "description": "SELLER Website Lead"
    }
    )
    u.send_simple_message(app.config["MAILGUN_LEADS_BASELINK"], "Leads - citybroker <leads@test.ca>",
                          "Warren John <warren@test.ca>", "NEW SELLER LEAD", "", leadinfo)


# Form element names are being validated here
BEDS_BATHS = {str(num) for num in range(1, 7)}
# Buyers
price = {str(num) for num in range(25000, 10025000, 25000)}
type = {"Single Family", "Condominium", "Multi-Family"}
areas = {"All Areas", "North London", "South London", "East London"}
buysell = {"Buying", "Selling", "Buying and Selling"}
emailupdates = {"Yes", "No"}

control_data = price, BEDS_BATHS, type, areas, buysell, emailupdates
to_validate = {"buysell", "areas", "minprice", "maxprice", "bedrooms", "bathrooms", "propertype", "emailupdates"}

buyersForm = ValidateForm(to_validate, *control_data)

# Sellers
type = {"Single Family / Residential Home", "Multi-Family Building", "Townhouse", "Condo"}
residentstatus = {"Primary Residence", "Secondary Residence", "Vacation Home", "Rental Property"}
relationship = {"Legal Owner", "Renter", "Property Manager", "Potential Buyer"}
plans = {"Now", "1-3 Months", "3-6 Months", "6+ Months", "Just Looking"}
listingstatus = {"Not Currently Listed", "For Sale By Owner", "Currently Listed with an Agent / Brokerage"}

to_validate = {"typeofhome", "bedrooms", "bathrooms", "residentstatus", "relationship", "planningtosell", "listingstatus"}
control_data = BEDS_BATHS, type, residentstatus, relationship, plans, listingstatus

sellersForm = ValidateForm(to_validate, *control_data)

control_data = {
    "status", "offerdate", "acceptancedate", "closedate", "listingcomm", "listingcommpctordol", "listingcommpctordol", "listingcommnetplushst",
    "listingcommnetplushst", "buyercomm", "buyercommpctordol", "buyercommpctordol", "buyercommnetplushst", "buyercommnetplushst", "financingduedate",
    "financingduetime", "inspectionduedate", "inspectionduetime", "insuranceduedate", "insuranceduetime", "statusduedate", "statusduetime",
    "sbpduedate", "sbpduetime", "endtype", "endtype", "endtype", "transactiontype", "transactiontype", "transactiontype", "transactiontype",
    "transactiontype", "mls", "address", "saleprice", "depositamt", "depositaccount", "depositaccount", "depositaccountother", "depositreceived",
    "depositreceived", "depositreceiveddate", "depositreceivedfrom", "buyer", "buyeraddress", "buyerphone",
    "buyeremail", "buyerlawyer", "buyerlawyeraddress", "buyerlawyerphone", "buyerlawyeremail", "buyermortgage", "buyermortgageaddress",
    "buyermortgagephone", "buyermortgageemail", "buyerrebate", "seller", "selleraddress", "sellerphone", "selleremail", "sellerlawyer",
    "sellerlawyeraddress", "sellerlawyerphone", "sellerlawyeremail", "sellermortgage", "sellermortgageaddress", "sellermortgagephone",
    "sellermortgageemail", "sellerrebate", "coopagentname", "coopagentbrokerage", "coopagentaddress", "coopagentphone", "coopagentemail",
    "othercond", "otherconddatedue", "othercondtimedue", "insideref", "insiderefamount", "insiderefpctordol", "outsideref", "outsiderefamount",
    "outsiderefbrokerage", "outsiderefaddress", "outsiderefphone", "outsiderefemail", "outsiderefpctordol", "chequenum", "depositinterest"}

tradeInputForm = ValidateForm(None, *control_data)

control_data = {"position", "datejoined", "password", "firstname", "lastname",
                "phone", "personalemail", "workemail", "reconum", "commplan", "hstnum", "admin"}
newAgentForm = ValidateForm(None, *control_data)

control_data = {
    "modify-form", "entrydate", "offerdate", "endtype", "transactiontype", "tradenum", "mls", "address", "status", "saleprice", "firmdate",
    "closedate", "depositaccount", "depositreceiveddate", "depositreceived", "depositreceivedfrom", "depositamt", "chequenum", "depositinterest",
    "referral-div", "internal-div", "add-inside-ref", "insidereferral-div", "outside-div", "referralout", "outsiderefbrokerage", "outsideref",
    "outsiderefaddress", "outsiderefemail", "outsiderefphone", "outsiderefpctordol", "outsiderefamount", "add-outside-ref",
    "outsidereferral-div", "listingcomm", "sellerrebate", "buyercomm", "buyerrebate", "financingduedate", "financingduetime", "inspectionduedate",
    "inspectionduetime", "insuranceduedate", "insuranceduetime", "sbpduedate", "sbpduetime", "statusduedate", "statusduetime", "conditions-div",
    "add-other-cond", "otherconditions-div", "buyer", "buyerphone", "buyeremail", "buyeraddress", "buyerlawyer", "buyerlawyerphone",
    "buyerlawyeraddress", "buyerlawyeremail", "buyermortgage", "buyermortgagephone", "buyermortgageaddress", "buyermortgageemail", "seller",
    "sellerphone", "selleraddress", "selleremail", "sellerlawyer", "sellerlawyerphone", "sellerlawyeraddress", "sellerlawyeremail", "sellermortgage",
    "sellermortgageaddress", "sellermortgagephone", "sellermortgageemail", "coopagentbrokerage", "coopagentname", "coopagentphone", "coopagentemail",
    "coopagentaddress", "referralin", "remove-refin", "remove-refout", "insideref", "insiderefamount", "insiderefpctordol", "othercond",
    "otherconddatedue", "othercondtimedue", "remove-condother"}

modifyTradeForm = ValidateForm(None, *control_data)

control_data = {"mls", "aps", "rep", "amend", "waiver", "nof", "801", "mutual", "depositcc", "fintracdeposit", "fintracid"}
uploadDocumentsForm = ValidateForm(None, *control_data)

control_data = {"current", "newpassword", "confirmpassword"}
changePasswordForm = ValidateForm(None, *control_data)

control_data = {'mls', 'status', 'address', 'price', 'bedrooms', 'bathrooms', 'mainphoto', 'photos', 'description'}
listingInputForm = ValidateForm(None, *control_data)
