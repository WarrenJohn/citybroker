import os
DEBUG = True
DATABASE_FOLDER = os.path.join(os.path.dirname(__file__), "database")
# Pathing essentially comes out to:
# C:\Users\My Name\My File\More Files\citybroker\citybroker\database\
STATIC_FOLDER = os.path.join(os.path.dirname(__file__), "static")
AGENTUPLOADS_FOLDER = os.path.join(os.path.dirname(__file__), "agentuploads")
LISTINGS_FOLDER = os.path.join(os.path.dirname(__file__), "static", "images", "listings")
CB_DATABASE = os.path.join(DATABASE_FOLDER, "citybroker.db")
ARTICLES_DATABASE = os.path.join(DATABASE_FOLDER, "articles.db")
BLOGS_DATABASE = os.path.join(DATABASE_FOLDER, "blogs.db")
LISTINGS_DATABASE = os.path.join(DATABASE_FOLDER, "listings.db")
MLSMAJ_DATABASE = os.path.join(DATABASE_FOLDER, "mlsmaj.db")
MLS_DATABASE = os.path.join(DATABASE_FOLDER, "mls.db")
ZONING_DATABASE = os.path.join(DATABASE_FOLDER, "zoning.db")
USE_SESSION_FOR_NEXT = True
ALLOWED_EXTENSIONS = set(['pdf'])
ALLOWED_IMAGES = set(['jpg', 'jpe', 'jpeg', 'png', 'gif', 'svg', 'bmp'])
