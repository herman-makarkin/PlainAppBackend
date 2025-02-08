# Welcome to the PlainApp docs


## Users

1. GET /user

    list all the users in the database

2. GET /user/:userId

    retrieve user by id

3. GET /user/byPN/:userPhoneNumber

    retrieve a user by phonenumber

4. GET /user/chatsM/:userId1/:userId2

    retrieve all the messages of a specific chat by user ids

5. GET /user/chats/:userId

    retrieve all the chats of a user

6.  DELETE /user/rm/userId

    delete a user

7. PUT /user/new

    create a user

        name: nullable,
        bio: nullable,
        birthdate: nullable,
        phoneNumber: required,

8. PATCH /user/update

    update a user

    recieves all user columns

## Chats

1. GET /chat

    list all the chats in the database

2. GET /chat/:chatId

    retrieve a chat by id

3. DELETE /chat/rm/:chatId

    delete a chat by id

4. PATCH /chat/update/:chatId

    update a chat
    
    recieves all chat columns

5. PUT /chat/new/:chatId

    create a chat

        participant1: required
        participant2: required

## Messages

1. GET /messages

    list all the messages

2. GET /message/:messageId

    retrieve a message by id

3. DELETE /message/:messageId

    delete a message by id

4. PUT /message/newChatM/:chatId

    create a message for a chat

        body: required
        createdBy: requred

5. PUT /message/newGroupM/:groupId

    create a message for a group

        body: required
        createdBy: requred

6. PATCH /message/update

    update a message

    recieves message columns

        notifyDate
        timesResent: not fully implemented yet

## Groups

1. GET /group

    list all the groups

2. GET /group/:groupId

    retrieve a group by id

3. DELETE /group/rm/:groupId

    delete a group

4. PATCH /group/update/:groupId

    update a group

    receives group columns

        metadata: jsonb
        name
        description
    
5. PUT /group/new

    create a group

        name: required
        description: nullable

6. POST /group/addUser/:groupId/:userId

    add new user

7. DELETE /group/rmUser/:groupId/:userId

    remove user


## Calls
not fully implemented yet




im gay
