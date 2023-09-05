let users=[
    {
        name:"ali",
        age:23,
        city:"karachi",
        country:"pakistan"
    },
    
    {
        name:"sara",
        age:25,
        city:"lahore",
        country:"pakistan"
    },
    
    {
        name:"john",
        age:21,
        city:"london",
        country:"UK"
    }
]

const u=users.map((user)=>user.name);
console.log(u)