import sqlite3
import random


class SimpleSQL3:
    """Table/db created upon init

    If working with an existing DB, leave the column_dict kwarg blank -
    column names will be populated automatically.

    database_name: looks for suffix '.db' - will add
    '.db' if not found. This can be overridden with the
    override boolean argument

    **column_dict takes the column name and the type:
    col_name='TEXT'

    Wildcard search: query = "%" + query + "%"

    fetch_all=True, change to false to use fetchone() func

    No fetchmany() support at this time, probably a simple if statement
    """

    def __init__(self, database_name, table_name, override=False, **column_dict):
        assert database_name and table_name is not None, "One/more missing: database_name, table_name"
        self.database_name = database_name
        self.table_name = table_name
        self.override = override

        if not override:
            if not self.database_name.endswith(".db"):
                self.database_name = f"{database_name}.db"
        else:
            self.database_name = database_name

        self.column_dict = column_dict

        if len(self.column_dict) is 0:
            # Gets the column names for working with an existing DB
            conn = sqlite3.connect(self.database_name)
            c = conn.cursor()
            c.execute(f"""SELECT * FROM {self.table_name}""")
            self.column_names = list(map(lambda x: x[0], c.description))
            self.column_types = ["TEXT"] * len(self.column_names)
            c.close()
            conn.close()
        else:
            self.column_names = list(self.column_dict.keys())
            self.column_types = list(column_dict.values())

        col_vals = "?," * len(str(self.column_names).split(","))
        self.col_vals = col_vals[:-1]

        self.columns = "".join([f"{a} {b.upper()}, " for a, b in zip(self.column_names, self.column_types)])[:-2]
        # Last 2 chars are always a space and comma

        conn = sqlite3.connect(self.database_name)
        c = conn.cursor()
        c.execute(f"CREATE TABLE IF NOT EXISTS {self.table_name} ({self.columns})")
        c.close()
        conn.close()

    def insert(self, *args):
        args = (args)
        assert len(args) == len(self.col_vals.split(',')), f"{len(args)} argument and {len(self.col_vals.split(','))} column - length do not match"

        conn = sqlite3.connect(self.database_name)
        c = conn.cursor()
        c.execute(f"""INSERT INTO {self.table_name} VALUES ({self.col_vals})""", args)
        conn.commit()
        c.close()
        conn.close()

    def select_cols_like(self, sel_col, like_col, query, fetch_all=True):
        assert fetch_all is not None, "fetch_all must be boolean"
        query = (query,)
        conn = sqlite3.connect(self.database_name)  # path to DB as well
        c = conn.cursor()
        c.execute(f"""SELECT {sel_col} FROM {self.table_name} WHERE {like_col} LIKE ?""", query)
        if not fetch_all:
            return c.fetchone()
        else:
            return c.fetchall()
        c.close()
        conn.close()

    def select_cols_equal(self, sel_col, equal_col, query, fetch_all=True):
        assert fetch_all is not None, "fetch_all must be boolean"
        query = (query,)
        conn = sqlite3.connect(self.database_name)  # path to DB as well
        c = conn.cursor()
        c.execute(f"""SELECT {sel_col} FROM {self.table_name} WHERE {equal_col}=?""", query)
        if not fetch_all:
            return c.fetchone()
        else:
            return c.fetchall()
        c.close()
        conn.close()

    def select_all_table(self, fetch_all=True):
        assert fetch_all is not None, "fetch_all must be boolean"
        conn = sqlite3.connect(self.database_name)  # path to DB as well
        c = conn.cursor()
        c.execute(f"""SELECT * FROM {self.table_name}""")
        if not fetch_all:
            return c.fetchone()
        else:
            return c.fetchall()
        c.close()
        conn.close()

    def update(self, set_col, where_col, set_var, where_var):
        conn = sqlite3.connect(self.database_name)  # path to DB as well
        c = conn.cursor()
        c.execute(f"""UPDATE {self.table_name} SET {set_col} = ? WHERE {where_col} = ?""", (set_var, where_var))
        conn.commit()
        c.close()
        conn.close()

    def delete(self):
        # TODO
        pass

    def custom_sql(self, sql_statement, fetch_all=True):
        conn = sqlite3.connect(self.database_name)  # path to DB as well
        c = conn.cursor()
        c.execute(f"""{sql_statement}""")
        if not fetch_all:
            return c.fetchone()
        else:
            return c.fetchall()
        conn.commit()
        c.close()
        conn.close()

    def __repr__(self):
        return f"\nDB Name: {self.database_name}, \nTable Name: {self.table_name}, \nOverride: {self.override},\nColumns: {self.column_dict}"

    def __str__(self):
        return f"\nDB Name: {self.database_name}, \nTable Name: {self.table_name}, \nOverride: {self.override},\nColumns: {self.column_dict}"
    # Add checks and balances: if column is TEXT then data=str(data), etc..


if __name__ == '__main__':
    # (self, database_name, table_name, override=False, **column_dict)
    day = "2018-08-19"
    my_table = SimpleSQL3("testDB", "testCols", False, col1="TEXT", col2="TEXT", col3="TEXT", col4="TEXT")
    my_table.insert(random.randint(1, 50), random.randint(1, 50), random.randint(1, 50), random.randint(1, 50))

    all_table = my_table.select_all_table()
    cols_eqal = my_table.select_cols_equal("col1", "col2", "9")  # sel_col, equal_col, query
    cols_like = my_table.select_cols_like("col3", "col4", "UPDATED")  # sel_col, like_col, query
    # cols_eqal.select_cols_equal("col1, col2, col3", "col4='SOMETHING' AND col5", day)  # Example of using 'AND' statement

    my_table.update("col1", "col1", "UPDATED", "12")  # set_col, where_col, set_var, where_var
    custom_thing = my_table.custom_sql("SELECT * FROM testCols")
