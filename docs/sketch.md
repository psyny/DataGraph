# Databases

## Element
- id: string, unique, user generated.
- <other>

# UI

## Field
- Can be read only
- Can be linked to a database
- Linked to Database: provide auto complete based on database id
- Linked to Database: can be read only or write new elements to the database




------------------------------------------

# Artifacts

## Model

A JSON defining an object structure.
A javascript object will be create from it, following certain rules.
A form can be create from it, following certain rules.\

# Modules

## Stereotype

- Create forms for each type of model.
- Manage auto complete.

## Object Form Controller

- Creates a form for a model.
- Fill a form with object data (both related to the same model).
- Fill an object with form data (both related to the same model).
- Add and delete list elements in a form.

## Database Controller

- 
