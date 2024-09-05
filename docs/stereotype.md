
# Description


# Structures

## Model
Model as defined by the user.

## Model Object
Data representation of the model. Its how its saved on the DB.
Should be composed of primitives and serializable to JSON.

## Model Form
Form based on the model.

## Model Gate
Links a Model, Model Object and a Model Form.


# Structure Flow

We need functions for:
- Create a Model Gate from a Model
- Create a Model Object from a Model Gate
- Create a Model Form from a Model Gate
- Create a Model Gate from a Model Object and a Model

The goal is to centralize functionality on Model Gates.

----------------------------------

# Model Gate Decoder
Travel thru a Model Gate object 

----------------------------------

# Model 

Its composed of primitives to be easily converted to a JSON.

## Fields

### name
Name of the model. Unique.

### label
Label to be displayed in forms and other visual representations.

### type
Data type of the model:
- number
- text
- boolean
- object
- list
- switch
- logic

### layout
Layout of the model when arranged in forms. Can be:
- row
- column

### subModel
For type=list, its the model the list is made of.
For type=logic, its the model the operands are.
Instead of defining a model, a string of a model name can be used. The refered model should be defined on the root of the models definitions.

### canBe
For type=switch, its the list of models the switch accepts.
Instead of defining a model, a string of a model name can be used. The refered model should be defined on the root of the models definitions.

### properties
For a type=object, this is a list of models that forms the properties of the object.
The property name will be the model name.
Instead of defining a model, a string of a model name can be used. The refered model should be defined on the root of the models definitions.


----------------------------------

# Model Form

## Parent DOM Element
 
## Container DOM Element

## Value DOM Element

----------------------------------

# Model Gate

Each element of model gate will have.

## Model
Refers the model this element represents.

## Value
Value for this element

## Model Form
Refers the form generated for this element. Can be null.








----------------------------------


# Use Cases

## Database based
Models are saved in database.
They are listed by its IDs.
They can be consulted, added or edited.

Dependencies:
- Database
- Models

Input:
- Model name
- Form action options (read only, write, etc)
- Callback for each action

Outputs:
- Form parent div, for inserting somewhere

## Non database based 
Can be the same specs as the database based.
But since the actions will not affect any database, the callbacks should return some info about the object.

Dependencies:
- Models

Input:
- Model name
- Model object (can be null)
- Form actions 
- Call back for each action

Outputs:
- Form parent div, for inserting somewhere

## Conclusion
Its possible to create a single class/function to cover both cases.
