const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

const usersToCreate = [
  {
    id: 1,
    name: "Michael",
    bio: "im gay",
  },
  {
    id: 2,
    name: "Ivan",
    bio: "im gay",
  },
  {
    id: 3,
    name: "Pedro",
    bio: "im gay",
  },
  {
    id: 4,
    name: "Pablo",
    bio: "im gay",
  },
];

const seed = async (users) => {
  for (const user of users) {
    console.log("Creating user: ", user);
    await client.post.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
};

seed(usersToCreate)
  .then(() => {
    console.log("Created/Updated users successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    client.$disconnect();
    console.log("Disconnected Prisma Client, exiting.");
  });
