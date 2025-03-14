import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt' //
import { z } from 'zod'; 

// const jwt=require("jsonwebtoken");
// const { JWT_SECRET } = require("./config");
const accRouter =new Hono()

//middleware before posting/updating any blog of a user
//we do authentication check
accRouter.use('/*',async(c,next)=>{
    const str=c.req.header("authorization")||""
    try{
    if(str==null||!str.startsWith("Bearer")){
        return c.text("error");
    }

    const tokenToVerify = str.split(' ')[1];
    console.log(tokenToVerify)
    const secretKey = c.env.JWT_SECRET

    const res = await verify(tokenToVerify, secretKey)
    console.log(res)
    if(res.id){
        //using 'c' context as store 
        // here keeping id in userId variable
        c.set("userId",res.id);
        console.log(c.get("userId"))
        console.log('correct middlew')
        await next();
    }else{
        c.status(403)
        return c.text("error");
    }
    }catch(e){
        c.status(403)
        return c.text('You Are Not Logged In')
    }
})


// "/api/v1/balance..."
accRouter.get('/balance', async function(c){
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const uid=c.get("userId")
    try{const acc= await prisma.account.findFirst({
        where:{
            userId: uid
        },
        select:{
            balance:true,
            userId:true
        }
        
    })
    //returning 
    return c.json({
        acc
    })
    
    }catch(e){
    console.log(e)
    c.status(411)
    return c.text('Error');
    }
})

const transferSchema = z.object({
    amount: z.number().positive(), 
    to: z.number(), 
});
// "/api/v1/transfer..."
accRouter.post("/transfer", async (c) => {
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const validation = transferSchema.safeParse(body);
    if (!validation.success) {
        c.status(400);
        console.log("unvalid")
        return c.json({ message: 'Invalid input' });
    }

    const { amount, to } = validation.data;
    console.log(validation.data)
    const uid = c.get("userId");
    console.log(uid)
    // const session = await mongoose.startSession();
    //we start a session as it ensures:
    // (i) Either it fully executes or None
    // (ii) Two transfer from same userid to same account cant be done at same time
    // ie. avoids double-spending attack

    // Fetch the accounts within the transaction
    try {
        const account = await prisma.account.findFirst({
            where: { userId: uid },
            select: { balance: true, id: true },
        });

        if (!account || account.balance < amount) {
            c.status(400);
            return c.json({ message: 'Insufficient balance' });
        }

        const toAccount = await prisma.account.findFirst({
            where: { userId: to },
            select: { id: true },
        });

        if (!toAccount) {
            c.status(400);
            return c.json({ message: 'Invalid account' });
        }
        //for atomic execution we wrap in transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Perform the transfer
            await prisma.account.update({
                where: { id: account.id },
                data: { balance: { decrement: amount } },
            });

            await prisma.account.update({
                where: { id: toAccount.id },
                data: { balance: { increment: amount } },
            });

            return { message: 'Transfer successful' };
        });

        return c.json(result);
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: e.message || 'Error during transfer' });
    }
});

export default accRouter