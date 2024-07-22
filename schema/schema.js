const graphql = require('graphql');
const axios = require('axios');

const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean,GraphQLSchema,GraphQLList,GraphQLNonNull} = graphql;


const CompanyType = new GraphQLObjectType({
  name:'Company',
  fields:() => (
    {
      id: {type : GraphQLString},
      name:{type : GraphQLString},
      desc:{type : GraphQLString},
      users:{
        type : new GraphQLList(UserType),
        resolve(parentValue,args){
          return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data)
        }
      }
    }
  )
})
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => (
    {
      id: {type: GraphQLString},
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      age: {type: GraphQLInt},
      isDead: {type:GraphQLBoolean},
      company:{
        type:CompanyType,
        resolve(parentValue,args){
          return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data)
        }
      }
    }
  )
})

const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields: {
    user:{
      type:UserType,
      args:{id:{type:GraphQLString}
      // , isDead:{type:GraphQLBoolean}
      },
      resolve(parentValue,args){
        // return _.find(users,{id:args.id,isDead:args.isDead})
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(resp => resp.data)
      }
    },
    company:{
      type:CompanyType,
      args:{id:{type:GraphQLString}},
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(resp => resp.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type: UserType,
            args: {
                firstName:{type: new GraphQLNonNull(GraphQLString)},
                lastName:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)},
                isDead: {type: GraphQLBoolean},
                companyId: {type:GraphQLString}
            },
            resolve(parentValue, {firstName, lastName, age}){
                return axios.post('http://localhost:3000/users',{firstName, lastName, age})
                    .then(resp => resp.data);
            }
        },
        deleteUser:{
            type: UserType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue, {id}){
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(resp => resp.data);
            }
        },
        editUser:{
            type: UserType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
                firstName:{type: GraphQLString},
                lastName:{type: GraphQLString},
                age:{type: GraphQLInt},
                isDead: {type: GraphQLBoolean},
                companyId: {type:GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${args.id}`,args)
                    .then(resp => resp.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})