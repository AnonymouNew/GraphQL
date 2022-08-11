const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList,
    GraphQLSchema
  } = require('graphql')
  
const app = express()

var Owners = [
    { id: 1, name: 'John Astle' },
    { id: 2, name: 'Gautam Sharma' },
    { id: 3, name: 'Kane Williamson' }
]

var Websites = [
    { id: 1, name: 'Facebook', ownerId: 1 },
    { id: 2, name: 'Google', ownerId: 2 },
    { id: 3, name: 'Amazon', ownerId: 3 },
    { id: 4, name: 'Github', ownerId: 1 },
    { id: 5, name: 'Medium', ownerId: 2 },
    { id: 6, name: 'Baidu', ownerId: 3 },
    { id: 7, name: 'Zapak', ownerId: 1 },
    { id: 8, name: 'Cricinfo', ownerId: 2 }
]

const WebsiteType = new GraphQLObjectType({
    name: 'Website',
    description: 'This represents a website made by a Owner(Programmer)',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      ownerId: { type: GraphQLInt },
    })
  })

  const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    description: 'This represents a owner of a website',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      websites: {
        type: new GraphQLList(WebsiteType),
        description: 'List of All Websites',
        resolve: () => Websites
      },
      owners: {
        type: new GraphQLList(OwnerType),
        description: 'List of All Owners',
        resolve: () => Owners
      }
    })
  })

  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addWebsite: {
        type: WebsiteType,
        description: 'Add a website',
        args: {
          name: { type: GraphQLString },
          ownerId: { type: GraphQLInt }
        },
        resolve: (parent, args) => {
          const website = { id: Websites.length + 1, name: args.name,ownerId:args.ownerId }
          Websites.push(website)
          return website
        }
      },
      removeWebsite: {
          type: WebsiteType,
          description: 'Remove a Website',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Websites = Websites.filter(website => website.id !== args.id)
              return Websites[args.id]
          }
        },
      addOwner: {
        type: OwnerType,
        description: 'Add an Owner',
        args: {
          name: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          const owner = { id: Owners.length + 1, name: args.name }
          Owners.push(owner)
          return owner
        }
      },
      removeOwner: {
          type: OwnerType,
          description: 'Remove an Owner',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Owners = Owners.filter(owner => owner.id !== args.id)
              return Owners[args.id]
          }
        },
        updateOwner: {
          type: OwnerType,
          description: 'Update an Owner',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)}
          },
          resolve: (parent, args) => {
              Owners[args.id - 1].name = args.name
              return Owners[args.id - 1]
          }
        },
        updateWebsite: {
          type: WebsiteType,
          description: 'Update a Website',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)},
            ownerId:{type:new GraphQLNonNull(GraphQLInt)}
          },
          resolve: (parent, args) => {
              Websites[args.id - 1].name = args.name
              Websites[args.id - 1].ownerId = args.ownerId
              return Websites[args.id - 1]
          }
        },
    })
  })

  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: schema
}))
app.listen(5000, () => console.log('Server Running'))