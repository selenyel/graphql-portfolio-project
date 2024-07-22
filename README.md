# GraphQL : Optimizing RESTful API calls
#### my-graphql-learning

[Tutorials Point](https://www.tutorialspoint.com/graphql/graphql_introduction.htm)

- GraphQL is for optimizing the RESTful API calls
- Developed by Facebook
- It is open source server-side technology
- It is an execution engine
- It is a data query language

## What does it solves?

- RESTful APIs can be LONG, COMPLEX and SPECIFIC for a single problem.
- Why not catch all we need in a single request ?
- Traverse
- Retrieve
- Modify


### Example

Get id and first name of each student :

`
{
students { 
id,
firstName
}
}
`

In order this to work, 

- First we would write a StudentType

`const StudentType = new GraphQLObjectType({`
`name:'Student',`
`fields:{`
`id:{type : GraphQLString},`
`firstName:{type : GraphQLString},`
`// otherThings if neccessary`
`}`
`})`

- Then we would need to say that my StudentType is reachable from RootQuery

`const RootQuery = new GraphQLObjectType({`
`name:'RootQueryType',`
`fields:{`
`students:{`
`type:StudentType,`
`args:{id:{type:GraphQLString}`
