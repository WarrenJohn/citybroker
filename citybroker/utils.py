from urllib.parse import urlparse, urljoin
import os
import requests
from datetime import datetime
from flask import request
from threading import Thread
from werkzeug.utils import secure_filename

from . import app


def async(f):
    def wrap(*args, **kwargs):
        thr = Thread(target=f, args=args, kwargs=kwargs)
        thr.start()
    return wrap


def send_complex_message(sender, recipients, title, html, list_of_tuples, text):
    return requests.post(
        app.config["MAILGUN_TRADES_BASELINK"] + "messages",
        auth=("api", app.config["MAILGUN_API_KEY"]),
        files=list_of_tuples,
        data={"from": sender,
              "to": recipients,
              "subject": title,
              "text": text,
              "html": html})


@async
def send_email_attachments(file_path, recipients, sender, subject, html, text):
    now = datetime.now()
    now = now.strftime("D%Y-%m-%dT%H-%M-%S")
    size_counter = 0
    indexer = 0
    file_list = [[]]
    for file in os.listdir(file_path):
        if file.endswith(".pdf"):
            full_file = file_path + "/" + file
            size_counter += os.path.getsize(full_file)
            # print("                      FILE SIZE: ", file, os.path.getsize(full_file))
            if size_counter < 24000000:
                file_list[indexer].append(file)
                # print("                      APPENDED FILE: ", file, os.path.getsize(full_file))
            else:
                # print("                      ---------------PACKAGE FILE SIZE: ", size_counter - os.path.getsize(full_file))
                indexer += 1
                size_counter = 0
                file_list += [[file]]
                size_counter += os.path.getsize(full_file)
                # print("                     NEW FILE LIST: ", file, os.path.getsize(full_file))
    # print("                      ---------------PACKAGE FILE SIZE: ", size_counter)
    # print(file_list)
    total = 0
    for each in file_list:
        total += 1
    indexer = 0

    for files in file_list:
        list_of_tuples = []
        indexer += 1
        title = str(indexer) + " of " + " " + str(total) + " " + subject
        for file in files:
            if file.endswith(".pdf"):
                full_file = os.path.join(file_path, file)
                open_file = open(full_file, "rb")
                attachment_tuple = ("attachment", (file, open_file))
                list_of_tuples.append(attachment_tuple)
        send_complex_message(sender, recipients, title, html, list_of_tuples, text)

        # print("--------------- email sent")
        # print("--------------- email sent", recipients)


@async
def send_simple_message(baselink, sender, recipients, subject, html, text):
    return requests.post(
        baselink + "messages",
        auth=("api", app.config["MAILGUN_API_KEY"]),
        data={"from": sender,
              "to": recipients,
              "subject": subject,
              "text": text,
              "html": html})


def remove_dynamics(original):
    """Iterates over the dict and creates a set of keys to be excluded, iterates over the dict again and removes the keys.
    """
    def _exclusions(dict_key, *exclude_params):
        if len(v.split(",")) >= 1:
            # The javascript appends an array to remove-XXX, this is checking for mulitple
            # elements, or just one.
            for item in v.split(","):
                for k2, v2 in original[dict_key][item].items():
                    for param in exclude_params:
                        if param in k2:
                            exclude_keys.add(k2)
                original[dict_key][v] = dict()
        else:
            for k2, v2 in original[dict_key][v].items():
                for param in exclude_params:
                    if param in k2:
                        exclude_keys.add(k2)
            original[dict_key][v] = dict()

    exclude_keys = {"remove-refin", "remove-refout", "remove-condother"}

    for k, v in request.form.items():
        if k == "remove-refin":
            if bool(request.form["remove-refin"]):
                _exclusions("referralin", *["insideref", "insiderefamount", "insiderefpctordol"])
        elif k == "remove-refout":
            if bool(request.form["remove-refout"]):
                _exclusions("referralout", *["outsideref", "outsiderefaddress", "outsiderefbrokerage", "outsiderefemail", "outsiderefpctordol",
                                             "outsiderefphone"])
        elif k == "remove-condother":
            if bool(request.form["remove-condother"]):
                _exclusions("conditionsother", *["othercond", "otherconddatedue", "othercondtimedue"])
    for key in exclude_keys:
        if key in original["trade"].keys():
            del original["trade"][key]


def sort_dynamics(main_dict, query, sorting_query, result_dict):
    """The data being sorted is generated dynamically by the user and produces an 'arbitrary' number of
    new nested dictionaries of whatever is being sorted.

    Takes the trades dict, looks for a query in one of the keys, creates a new key,
    then sorts all the related form data into their nested dicts.

    Checks existing keys against the sorting_query+index, if it doesn't exist it will use the number that
    was passed through as the new key. It pulls the number off of one of the keys like 'outsideref3' and
    uses it for the new 'referralout3' nested dict.

    Used for checking if there are any referrals included in the trade, whether internal or external,
    and also if there are any extra conditions.

    **dynamics in the name refers to the dynamic fields in the trade input form (add inside referral,
    outside referral, and extra conditions)**
    """
    sorting_key = ""
    for k, v in main_dict.items():
        if query in k:
            for index, letter in enumerate(k):
                if letter.isdigit():
                    sorting_key = sorting_query+k[index:]
                    if sorting_key in result_dict.keys():
                        #  Checking for an existing key to avoid overwriting the existing key
                        continue
                    else:
                        result_dict[sorting_key] = {}
                    break
            result_dict[sorting_key][k] = v
    return result_dict


def getreferral(referral, subtotal, hstamt, BASE, HST):
    """Accepts and arbitrary number of referrals and and calculates the corresponding amounts.
    Reduces the subtotal and hstamt arguments and returns them as well as an updated dictionary
    with the correct referral amounts.

    Essentially transfers the money from the subtotal and hstmt into the referral dictionary, but
    will do this for multiple referrals while keeping track of everyone's money by appending three
    new keys in 'their' dictionary.
    """

    for k, v in referral.items():
        for k2, v2 in referral[k].items():
            if "amount" in k2:
                refamt = v2
            elif "pctordol" in k2:
                refpctordol = v2
        if refpctordol == "percent":
            refamt = refamt / 100
            referral[k]["subtotal"] = round(BASE * refamt, 2)
            referral[k]["totalhst"] = round((BASE * refamt) * HST, 2)
            referral[k]["total"] = round((BASE * refamt) + ((BASE * refamt) * HST), 2)
            subtotal = round(subtotal - referral[k]["subtotal"], 2)
            hstamt = round(hstamt - referral[k]["totalhst"], 2)
        else:
            referral[k]["subtotal"] = round(refamt, 2)
            referral[k]["totalhst"] = round(refamt * HST, 2)
            referral[k]["total"] = round(refamt + (refamt * HST), 2)
            subtotal = round(subtotal - referral[k]["subtotal"], 2)
            hstamt = round(hstamt - referral[k]["totalhst"], 2)
    return referral, subtotal, hstamt


def make_link(link_list, function):
    links = []
    baselink = "https://www.google.ca/search?q="
    for index in function:
        # index[0] used to select & split the first word - these come out as tuples
        splitter = index[0].split()
        links.append("+".join(splitter))
    for google_link in links:
        link_list.append(baselink + google_link)


def hst_incl(type):
    if type == "plus":
        return True
    return False


def is_percent(type):
    if type == "percent":
        return True
    return False


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
        ref_url.netloc == test_url.netloc


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


def remove_invalid(original):
    parsed = list()
    original = filter((lambda x: x is not None), original)
    original = filter((lambda x: len(x) > 0), original)
    parsed += [each for each in original]
    return parsed


def handle_uploads(trade):
    now = datetime.now()
    now = now.strftime("D%Y-%m-%dT%H-%M-%S")

    filenames_switch = {
        "mls": "lawyer-mortgage",
        "aps": "lawyer-mortgage",
        "rep": "brokerage",
        "amend": "lawyer-mortgage",
        "waiver": "lawyer-mortgage",
        "nof": "lawyer-mortgage",
        "depositcc": "brokerage",
        "fintracdeposit": "brokerage",
        "fintracid": "brokerage",
        "801": "brokerage",
        "mutual": "lawyer-mortgage"
    }
    file = request.files.getlist

    for each in request.files:
        dirname_insert = str(filenames_switch[each])
        if each not in request.files:
            continue
        file = request.files[each]
        if file.filename == '':
            continue
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(app.config["AGENTUPLOADS_FOLDER"], "trade" + str(trade["trade"]["tradenum"]), dirname_insert + str(now))
            if not os.path.exists(path):
                os.makedirs(path)
            app.config["UPLOAD_FOLDER"] = path
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    agentuploads = os.path.abspath("agentuploads")
    file_path = os.path.join(app.config["AGENTUPLOADS_FOLDER"], "trade" + str(trade["trade"]["tradenum"]), dirname_insert + str(now))
    return trade, agentuploads, file_path


def complex_email_content(trade, uploads, file_path):
    def _content(endtype):
        recipients = list()
        subject = f"Deal {trade['trade']['address']} {trade['trade'][endtype]}"
        agent_name = f"{trade['user']['first'].upper()} {trade['user']['last'].upper()}"
        names = ["citybroker - Admin", agent_name, trade["trade"][endtype+"mortgage"], trade["trade"][endtype+"lawyer"]]
        emails = ["admin@test.ca", trade["user"]["email"], trade["trade"][endtype+"mortgageemail"], trade["trade"][endtype+"lawyeremail"]]
        names = remove_invalid(names)
        emails = remove_invalid(emails)
        emails = [f" <{ele}>" for ele in emails]
        for index, ele in enumerate(names):
            recipients.append(names[index] + emails[index])

        other_lawyer_switch = {
            "buyer": f"""Seller's Lawyer:
            {trade["trade"]["sellerlawyer"]}
            {trade["trade"]["sellerlawyeremail"]}
            {trade["trade"]["sellerlawyerphone"]}
            {trade["trade"]["sellerlawyeraddress"]}
                """,
            "seller": f"""Buyer's Lawyer:
            {trade["trade"]["buyerlawyer"]}
            {trade["trade"]["buyerlawyeremail"]}
            {trade["trade"]["buyerlawyerphone"]}
            {trade["trade"]["buyerlawyeraddress"]}"""
        }
        sender = f"{agent_name} <{trade['user']['email']}>"
        text = f"""
            Please confirm receipt of this email.

            Deal: {trade['trade']['address']}
            Client(s):
            {trade["trade"][endtype]}
            {trade["trade"][endtype+"email"]}
            {trade["trade"][endtype+"phone"]}

            Conditions are due:"""
        if bool(trade["trade"]["financingduedate"]):
            text += f"""
            Financing: {trade["trade"]["financingduedate"]} at {trade["trade"]["financingduetime"]}"""
        if bool(trade["trade"]["insuranceduedate"]):
            text += f"""
            Insurance:  {trade["trade"]["insuranceduedate"]} at {trade["trade"]["insuranceduetime"]}"""
        if bool(trade["trade"]["inspectionduedate"]):
            text += f"""
            Inspection: {trade["trade"]["inspectionduedate"]} at {trade["trade"]["inspectionduetime"]}"""
        if bool(trade["trade"]["statusduedate"]):
            text += f"""
            Status Certificate: {trade["trade"]["statusduedate"]} at {trade["trade"]["statusduetime"]}"""
        if bool(trade["trade"]["sbpduedate"]):
            text += f"""
            Sale of the Buyers Property: {trade["trade"]["sbpduedate"]} at {trade["trade"]["sbpduetime"]}"""

        if bool(trade["conditionsother"]):
            for key, value in trade["conditionsother"].items():
                cond_string = list()
                for k, v in trade["conditionsother"][key].items():
                    cond_string.append(v)
            text += f"""
            {cond_string[0]}: {cond_string[1]} at {cond_string[2]}"""

        text += f"""
            Lawyer & Mortgage Broker Information

            Clients Lawyer:
            {trade["trade"][endtype+"lawyer"]}
            {trade["trade"][endtype+"lawyeremail"]}
            {trade["trade"][endtype+"lawyerphone"]}
            {trade["trade"][endtype+"lawyeraddress"]}

            Mortgage Broker:
            {trade["trade"][endtype+"mortgage"]}
            {trade["trade"][endtype+"mortgageemail"]}
            {trade["trade"][endtype+"mortgagephone"]}
            {trade["trade"][endtype+"mortgageaddress"]}

            {other_lawyer_switch[endtype]}

        """

        return recipients, sender, subject, "", text
    if trade["trade"]["endtype"].lower() == "buyer":
        pass
        send_email_attachments(file_path, *_content("buyer"))

    elif trade["trade"]["endtype"].lower() == "seller":
        send_email_attachments(file_path, *_content("seller"))

    else:
        # Sending Seller Info
        send_email_attachments(file_path, *_content("seller"))
        # Sending Buyer Info
        send_email_attachments(file_path, *_content("buyer"))


def slugify(string):
    string = string.replace(" ", "-").replace(",", "-")
    last_letter = ""
    slug = ""
    for letter in string:
        if last_letter == letter and last_letter == "-":
            last_letter = letter
            continue
        elif letter == "-":
            slug += letter
            last_letter = letter
        elif letter.isalnum():
            slug += letter
            last_letter = letter
        else:
            last_letter = letter
            continue
    return slug


def _handle_listing_upload():
    listing = dict()
    slug = slugify(f'{request.form["address"]}-{request.form["mls"]}')
    listing_folder = os.path.join(app.config["LISTINGS_FOLDER"], slug)
    if not os.path.exists(listing_folder):
        os.makedirs(listing_folder)
    for photo in request.files.getlist("photos"):
        file_name = secure_filename(photo.filename)
        for type in app.config["ALLOWED_IMAGES"]:
            if file_name.endswith(type):
                photo.save(os.path.join(listing_folder, file_name))
    listing["MLS"] = request.form["mls"]
    listing["Status"] = request.form["status"]
    listing["Address"] = request.form["address"]
    listing["Price"] = request.form["price"]
    listing["Beds"] = request.form["bedrooms"]
    listing["Baths"] = request.form["bathrooms"]
    listing["Description"] = request.form["description"].replace("\r\n", "<br>")
    file_name = secure_filename(request.files["mainphoto"].filename)
    main_pic = file_name
    folder = os.path.join("static", "images", "listings", slug)

    return slug, listing, main_pic, folder
