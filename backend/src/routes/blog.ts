
import { Hono, } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@coderinthenorth/medium-app-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>()

blogRouter.use('/*', async (c, next) => {
  const header = c.req.header('Authorization') || '';
  const token = header.split(' ')[1];
  try{
    const user = await verify(token, c.env.JWT_SECRET);

    if (user) {
      c.set('userId', user.id as string);
      await next();
    } else {
      c.status(403);
      return c.json({ error: 'unautherized' });
    }
  } catch(e) {
    c.status(403);
    return c.json({ error: 'unautherized' });
  }
  
})

blogRouter.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "invalid input" });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId
      }
    });
    return c.json({
      id: blog.id
    })
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while creating blog" });
  }
})

blogRouter.put('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "invalid input" });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId
      },
      data: {
        title: body.title,
        content: body.content,
      }
    })
    return c.text('updated successfully')
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while updating blog" });
  }
})

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany();
    return c.json(blogs);
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while getting blogs" });
  }
})

blogRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id
      }
    });
    return c.json(blog);
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while getting blog" });
  }
})

