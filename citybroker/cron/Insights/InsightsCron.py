from SimpleSQL3 import SimpleSQL3
from datetime import datetime, timedelta
from collections import namedtuple
import os

# CONSTANTS

MLSMAJ_DB = os.path.join(os.path.split(os.path.abspath(os.pardir))[0], "database", "mlsmaj.db")  # Production
MLS_MAP = SimpleSQL3(MLSMAJ_DB, "mls_map")

TODAY = datetime.today()
SEVEN_DAYS_AGO = TODAY - timedelta(7)
ONE_YR_AGO = TODAY - timedelta(365)
YEAR, MONTH, DAY = TODAY.strftime("%Y-%m-%d").split("-")
# PIN is grabbed in TODAY_SEVEN because the dict holds sets, which will filter out any doubles
TODAY_SEVEN = MLS_MAP.custom_sql(f"""SELECT pin, email_type, major_area FROM mls_map
                            WHERE date BETWEEN '{SEVEN_DAYS_AGO.strftime('%Y-%m-%d')}'
                            AND '{TODAY.strftime('%Y-%m-%d')}'""")
list_sell = namedtuple("lsr", ["list", "sold", "ratio"])
IgnoredPins = namedtuple("IgnoredPins", ["not_sold", "cond_not_sold"])

# FUNCTIONS


def parse_price_gen(table_data):
    table_data = (x[0][3:] for x in table_data)  # First 3 characters are junk
    table_data = (item.split(" ")[0].replace(",", "") for item in table_data)
    return table_data


def parse_price(parse_this):
    x = parse_this[3:].replace(",", "").split(" ")[0]
    return x


def get_average(avg_this, return_int=True):
    temp = 0
    for count, num in enumerate(avg_this, 1):
        temp += float(num)
    if return_int:
        return int(temp/count)
    else:
        return float(temp/count)


def get_timespent(ignrd_pins, ref_dict, xref_dict, getsold=True):
    temp_list = []
    if getsold:
        for t in ref_dict:
            if t[0] in ignrd_pins:
                continue
            for x in xref_dict:
                if t[0] in x:
                    temp_list.append(abs((datetime.strptime(t[3], "%Y-%m-%d") - datetime.strptime(x[3], "%Y-%m-%d")).days))
        return temp_list
    else:
        for t in ref_dict:
            if t[0] in ignrd_pins:
                continue
            for x in xref_dict:
                if t[0] in x:
                    temp_list.append(abs((datetime.strptime(t[3], "%Y-%m-%d") - datetime.strptime(x[3], "%Y-%m-%d")).days))
        return temp_list


# SEVEN DAY COUNT
# Dict keys are abbreviations of the searches: na is North Active
status_area = {

    "na": len({a for a in TODAY_SEVEN if "ACTIVE" in a for z in a if "NORTH" in z}),
    "sa": len({a for a in TODAY_SEVEN if "ACTIVE" in a for z in a if "SOUTH" in z}),
    "ea": len({a for a in TODAY_SEVEN if "ACTIVE" in a for z in a if "EAST" in z}),
    "nc": len({a for a in TODAY_SEVEN if "CONDITIONAL" in a for z in a if "NORTH" in z}),
    "sc": len({a for a in TODAY_SEVEN if "CONDITIONAL" in a for z in a if "SOUTH" in z}),
    "ec": len({a for a in TODAY_SEVEN if "CONDITIONAL" in a for z in a if "EAST" in z}),
    "ns": len({a for a in TODAY_SEVEN if "SOLD" in a for z in a if "NORTH" in z}),
    "ss": len({a for a in TODAY_SEVEN if "SOLD" in a for z in a if "SOUTH" in z}),
    "es": len({a for a in TODAY_SEVEN if "SOLD" in a for z in a if "EAST" in z})

}

# SEVEN DAY COUNT END

# AVERAGE PRICES START

north_avg = get_average(parse_price_gen(MLS_MAP.custom_sql(f"""SELECT info FROM mls_map
                            WHERE email_type='SOLD' AND major_area='NORTH' AND date BETWEEN '{ONE_YR_AGO.strftime('%Y-%m-%d')}'
                            AND '{TODAY.strftime('%Y-%m-%d')}'""")))
south_avg = get_average(parse_price_gen(MLS_MAP.custom_sql(f"""SELECT info FROM mls_map
                            WHERE email_type='SOLD' AND major_area='SOUTH' AND date BETWEEN '{ONE_YR_AGO.strftime('%Y-%m-%d')}'
                            AND '{TODAY.strftime('%Y-%m-%d')}'""")))
east_avg = get_average(parse_price_gen(MLS_MAP.custom_sql(f"""SELECT info FROM mls_map
                            WHERE email_type='SOLD' AND major_area='EAST' AND date BETWEEN '{ONE_YR_AGO.strftime('%Y-%m-%d')}'
                            AND '{TODAY.strftime('%Y-%m-%d')}'""")))
city_avg = int((north_avg+south_avg+east_avg)/3)
# AVERAGE PRICES END

# AVERAGE DOM FOR LAST 30 DAYS
"""Select all SOLD, COND & ACTIVE last 365 days
Compare the pins, if active pin exists in sold pins then timedelta the dates, if not then ditch the pin
"""
# DOM = days on market
one_yr = MLS_MAP.custom_sql(f"""SELECT pin, major_area, email_type, date, info FROM mls_map
                            WHERE date BETWEEN '{ONE_YR_AGO.strftime('%Y-%m-%d')}' AND '{TODAY.strftime('%Y-%m-%d')}'""")

one_yr_pins = {
    "active": {
        "pins": {x[0] for x in one_yr if "ACTIVE" in x},
        "data": {x for x in one_yr if "ACTIVE" in x}
    },
    "cond": {
        "pins": {x[0] for x in one_yr if "CONDITIONAL" in x},
        "data": {x for x in one_yr if "CONDITIONAL" in x}
    },
    "sold": {
        "pins":  {x[0] for x in one_yr if "SOLD" in x},
        "data": {x for x in one_yr if "SOLD" in x}
    }
}

north_one_yr_pins = {
    "active": {
        "data": {x for x in one_yr_pins["active"]["data"] if "NORTH" in x}
    },
    "cond": {
        "data": {x for x in one_yr_pins["cond"]["data"] if "NORTH" in x}
    },
    "sold": {
        "data": {x for x in one_yr_pins["sold"]["data"] if "NORTH" in x}
    }
}

south_one_yr_pins = {
    "active": {
        "data": {x for x in one_yr_pins["active"]["data"] if "SOUTH" in x}
    },
    "cond": {
        "data": {x for x in one_yr_pins["cond"]["data"] if "SOUTH" in x}
    },
    "sold": {
        "data": {x for x in one_yr_pins["sold"]["data"] if "SOUTH" in x}
    }
}

east_one_yr_pins = {
    "active": {
        "data": {x for x in one_yr_pins["active"]["data"] if "EAST" in x}
    },
    "cond": {
        "data": {x for x in one_yr_pins["cond"]["data"] if "EAST" in x}
    },
    "sold": {
        "data": {x for x in one_yr_pins["sold"]["data"] if "EAST" in x}
    }
}


IgnoredPins = IgnoredPins(not_sold=one_yr_pins['active']['pins'] - one_yr_pins['sold']['pins'],
                          cond_not_sold=one_yr_pins['cond']['pins'] - one_yr_pins['sold']['pins'])

city_avg_dom = get_average(get_timespent(IgnoredPins.not_sold, one_yr_pins['active']['data'], one_yr_pins['sold']['data']))
time_spent_cond = get_average(get_timespent(IgnoredPins.not_sold, one_yr_pins['cond']['data'], one_yr_pins['sold']['data'], False))

maj_area_time = {
    "north": {
        "dom": get_average(get_timespent(IgnoredPins.not_sold, north_one_yr_pins['active']['data'], one_yr_pins['sold']['data'])),
        "cdom": get_average(get_timespent(IgnoredPins.not_sold, north_one_yr_pins['cond']['data'], one_yr_pins['sold']['data'], False))
    },
    "south": {
        "dom": get_average(get_timespent(IgnoredPins.not_sold, south_one_yr_pins['active']['data'], one_yr_pins['sold']['data'])),
        "cdom": get_average(get_timespent(IgnoredPins.not_sold, south_one_yr_pins['cond']['data'], one_yr_pins['sold']['data'], False))
    },
    "east": {
        "dom": get_average(get_timespent(IgnoredPins.not_sold, east_one_yr_pins['active']['data'], one_yr_pins['sold']['data'])),
        "cdom": get_average(get_timespent(IgnoredPins.not_sold, east_one_yr_pins['cond']['data'], one_yr_pins['sold']['data'], False))
    }
}

# END AVERAGE DOM

# TODAY SECTION START

today_active = [x for x in one_yr_pins['active']['data'] if TODAY.strftime("%Y-%m-%d") in x]
today_cond = [x for x in one_yr_pins['cond']['data'] if TODAY.strftime("%Y-%m-%d") in x]
today_sold = [x for x in one_yr_pins['sold']['data'] if TODAY.strftime("%Y-%m-%d") in x]

# TODAY SECTION END

# LIST TO SALE RATIO %
temp_list = []
for t in one_yr_pins['active']['data']:
    if t[0] in IgnoredPins.not_sold:
        continue
    for x in one_yr_pins['sold']['data']:
        if t[0] in x:
            temp_list.append(list_sell(list=int(parse_price(t[4])), sold=int(parse_price(x[4])),
                                       ratio=round(int(parse_price(x[4]))/int(parse_price(t[4])), 2)))

avg_lsr = int(get_average([x.ratio for x in temp_list], False)*100)

# END LIST TO SALE RATIO %

# INSIGHTS PAGE OUTPUTS

insights = SimpleSQL3(MLSMAJ_DB, "insights", False,
                      date="TEXT", today_active="INTEGER", today_cond="INTEGER", today_sold="INTEGER", north_avg="INTEGER", south_avg="INTEGER",
                      east_avg="INTEGER", city_avg="INTEGER", city_avg_dom="INTEGER", north_avg_dom="INTEGER", south_avg_dom="INTEGER",
                      east_avg_dom="INTEGER", time_spent_cond="INTEGER", avg_lsr="INTEGER", status_area="TEXT")

insights_insert = TODAY.strftime("%Y-%m-%d"), len(today_active), len(today_cond), len(
    today_sold), north_avg, south_avg, east_avg, city_avg, city_avg_dom, str(maj_area_time["north"]), str(maj_area_time["south"]), str(
    maj_area_time["east"]), time_spent_cond, avg_lsr, str(status_area)
insights.insert(*insights_insert)
