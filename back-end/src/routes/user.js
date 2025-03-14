import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import zod from 'zod'
const userRouter =new Hono()

//REGISTER   "/api/v1/user/signup"
const schema=zod.object({
    email:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
})

userRouter.post('/signup',async (c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())
      
    const body=await c.req.json()
    const ans=schema.safeParse(body);
    
    if(!ans.success){
    c.status(411)
    return c.text('Unvalidated Input')
    }

    try{
        const res= await prisma.user.create({
          data:{
            email:body.email,
            firstName:body.firstName,
            lastName:body.lastName,
            password:body.password,
          },
          
        })
        
        //--
        const payload = {
          id: res.id,
        }
        await prisma.account.create({
            data:{
                userId:payload.id,
                balance: 1 + Math.random() * 10000//random bal b/w 1 to 10k
            },
               
        })
        const secret = c.env.JWT_SECRET
        const token= await sign(payload, secret)
        return c.json({
          "token":token,
        })
        
      }catch(e){
        console.log(e)
        c.status(411)
        return c.text('Error');
      }
})



// LOGIN  // "/api/v1/user/signin"
const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})

userRouter.post("/signin", async (c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    const body=await c.req.json()
    const ans = signinBody.safeParse(body)
    if(!ans.success){
        c.status(411)
        return c.text('Unvalidated Input')
    }
    try{
        const res= await prisma.user.findUnique({
          where:{
            email:body.email,
            password:body.password,
          },
          
        })
        console.log(res)
        if(!res){
          c.status(403)//unauthorized
          return c.text("User Not in Database")
        }
        //--
        const payload = {
          id: res.id,
        }
        const secret = c.env.JWT_SECRET
        const token= await sign(payload, secret)
        return c.json({
          "token":token,
         
        })
      }catch(e){
        console.log(e);
        c.status(411)
        return c.text("Error")
    
      }
      
})

/*
// UPDATION (REQUIRES MIDDLEWARE 'TOKEN' CHECK)
// "/api/v1/"  --- updation

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})

userRouter.put("/", middleware, async (req, res) => {
    const ANS= updateBody.safeParse(req.body)//AS THIS RETURNS AN OBJECT
    if (!ANS.success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    // updates the firstName, lastName, password (whivhever provided) for the user with the specified id
    await User.updateOne(
        { _id: req.userId }, // At _id
        { $set: req.body }   // Update only specified fields
    );

    res.json({
        message: "Updated successfully"
    })
})
*/

// SEARCH : eg. "/api/v1/bulk?filter=har"
//  it will return users whose first or last names contain "har".

userRouter.get("/bulk", async (c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const filter = c.req.query('filter') || '';
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    firstName: {
                        contains: filter, 
                        mode: 'insensitive', // Case-insensitive search
                    },
                },
                {
                    lastName: {
                        contains: filter,
                        mode: 'insensitive',
                    },
                },
            ],
        },
    });
 
    return c.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id
        }))
    })
})

export default userRouter;