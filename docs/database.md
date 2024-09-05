
Each database can have 2 types of indexing

- Sequential Int Key: where each entry is keyed by an int number. Storage method is an array/list.

- Random String Key: each entry is keyed by an string. Storage method is an object/map.


# Sequential Int Key
- Deleted entries becomes null. Indexes are never reutilized. So references are kept consistent.


# Random String Key
- Deleted entries are deleted from the object. Indexes can be reutilized. 




