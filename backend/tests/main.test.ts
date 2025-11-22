import test, { after, describe } from "node:test";
import assert from "node:assert";
import supertest from "supertest";

import app from "../src/index";
import { UserModel, User } from "../src/models/user";
import mongoose from "mongoose";
import { game, user } from "./utils";
import { gameModel } from "../src/models/game";

const api = supertest(app);

describe("User API", () => {
  test("create user", async () => {
    const res = await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const db_user: User | null = await UserModel.findById(res.body.id);

    assert.ok(db_user, "User not found in database");
    assert.notEqual(db_user?.passwordHash, user.password);
  });

  test("invalid email throws error", async () => {
    const newuser = { ...user };
    newuser.username = "anotheruser";
    newuser.email = "invalidemail";
    await api.post("/api/users").send(newuser).expect(400);
  });

  test("same username throws error", async () => {
    const newuser = { ...user };
    newuser.email = "anotherone@gmail.com";
    await api.post("/api/users").send(newuser).expect(400);
  });

  test("same email throws error", async () => {
    const newuser = { ...user };
    newuser.username = "anotheruser";
    await api.post("/api/users").send(newuser).expect(400);
  });
});

describe("Login API", () => {
  const loginUser = { username: user.username, password: user.password };

  test("invalid user", async () => {
    const invalidUser = { ...loginUser };
    invalidUser.username = "invalid";
    await api
      .post("/api/login")
      .send(invalidUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("invalid password", async () => {
    const invalidUser = { ...loginUser };
    invalidUser.password = "invalid";
    await api
      .post("/api/login")
      .send(invalidUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("valid user", async () => {
    const res = await api
      .post("/api/login")
      .send(loginUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.ok(res.headers["x-csrf-token"], "No csrf token");
    assert.ok(res.headers["set-cookie"], "No cookie set");
    assert(res.body.username == user.username);
  });

  test("get current user", async () => {
    const agent = supertest.agent(app);
    const res = await agent.post("/api/login").send(loginUser).expect(200);
    await agent
      .get("/api/login/me")
      .set("x-csrf-token", res.headers["x-csrf-token"])
      .expect(200);
  });

  test("logout user", async () => {
    await api.post("/api/login/logout").expect(200);
  });
});

describe("Guides API", () => {
  const agent = supertest.agent(app);
  const loginUser = { username: user.username, password: user.password };
  let guideId: string;
  test("authenticated author", async () => {
    const newGame = await new gameModel(game).save();

    const guide = {
      content: "This is another guide",
      title: "Guide Title",
      tags: "tag1,tag2",
      game: newGame._id,
    };
    const auth = await agent.post("/api/login").send(loginUser).expect(200);

    const res = await agent
      .post("/api/guides")
      .set("x-csrf-token", auth.headers["x-csrf-token"])
      .send(guide)
      .expect(201);

    assert.strictEqual(res.body.content, guide.content);
    assert.equal(res.body.author.username, loginUser.username);
    guideId = res.body.id;

    const db_user = await UserModel.findOne({
      username: loginUser.username,
    });

    // the author has the post in their posts array
    assert.ok(db_user?.guides.includes(res.body.id), "Post not in user posts");
  });

  test("fetch the created guide", async () => {
    const guide = await agent.get(`/api/guides/${guideId}`).expect(200);

    assert.equal(guide.body.id, guideId);
    assert.equal(guide.body.author.username, loginUser.username);
  });
});

after(async () => {
  await UserModel.deleteMany({});
  await mongoose.connection.close();
});
