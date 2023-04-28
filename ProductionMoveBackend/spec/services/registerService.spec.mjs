// require("../helpers/spec-helper");

import authenticationServices from "../../src/services/authenticationServices.js";
import bcryptServices from "../../src/services/bcryptServices.js";
import partnerServices from "../../src/services/partnerServices.js";
import db from "../../src/models/index.js";
import { Op } from "sequelize";
import ejs from "ejs";

// Custom matchers
import customMatcher from "../helpers/test-helpers.js";

describe("Test Register Service", () => {
  beforeAll(() => {
    jasmine.addMatchers(customMatcher);
  });

  it("Should reject message authentication failed because of invalid token", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(Promise.reject({ name: "token invalid" }));
    const spyFindOne = spyOn(db.Partners, "findOne").and.stub();
    const spyHashPass = spyOn(bcryptServices, "hash").and.stub();
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        { userName: "any", password: "any", email: "email" },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Authentication failed: token invalid");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).not.toHaveBeenCalled();
        expect(spyHashPass).not.toHaveBeenCalled();
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message authentication failed because of not permission", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 2 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.stub();
    const spyHashPass = spyOn(bcryptServices, "hash").and.stub();
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        { userName: "any", password: "any", email: "any" },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Authentication failed: Not Permission");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).not.toHaveBeenCalled();
        expect(spyHashPass).not.toHaveBeenCalled();
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error when findOne error", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.reject()
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.stub();
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        { userName: "any", password: "any", email: "any" },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Database Error!");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "any" }, { email: "any" }],
          },
        });
        expect(spyHashPass).not.toHaveBeenCalled();
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message username existed", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.resolve({ userName: "existedUsername", email: "anotherEmail" })
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.stub();
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        {
          userName: "existedUsername",
          password: "anyPassword",
          email: "anyEmail",
        },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Username existed");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "existedUsername" }, { email: "anyEmail" }],
          },
        });
        expect(spyHashPass).not.toHaveBeenCalled();
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message email existed", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.resolve({ userName: "otherUsername", email: "existedEmail" })
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.stub();
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        {
          userName: "anyUsername",
          password: "anyPassword",
          email: "existedEmail",
        },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Email existed");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "anyUsername" }, { email: "existedEmail" }],
          },
        });
        expect(spyHashPass).not.toHaveBeenCalled();
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message internal server error", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.resolve(null)
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.returnValue(
      Promise.reject()
    );
    const spyCreate = spyOn(db.Partners, "create").and.stub();
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        {
          userName: "anyUsername",
          password: "anyPassword",
          email: "anyEmail",
        },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Internal Server Error!");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "anyUsername" }, { email: "anyEmail" }],
          },
        });
        expect(spyHashPass).toHaveBeenCalledTimes(1);
        expect(spyHashPass).toHaveBeenCalledWith("anyPassword");
        expect(spyCreate).not.toHaveBeenCalled();
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should reject message internal database error when create error", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.resolve(null)
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.returnValue(
      Promise.resolve({ data: "hashed-pass" })
    );
    const spyCreate = spyOn(db.Partners, "create").and.returnValue(
      Promise.reject("create error")
    );
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        {
          userName: "anyUsername",
          password: "anyPassword",
          email: "anyEmail",
        },
        "token"
      )
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Database Error!");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "anyUsername" }, { email: "anyEmail" }],
          },
        });
        expect(spyHashPass).toHaveBeenCalledTimes(1);
        expect(spyHashPass).toHaveBeenCalledWith("anyPassword");
        expect(spyCreate).toHaveBeenCalledTimes(1);
        expect(spyCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({
            userName: "anyUsername",
            email: "anyEmail",
            password: "hashed-pass",
          })
        );
        expect(spyEjs).not.toHaveBeenCalled();
      });
  });

  it("Should resolve message create successful", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: { data: { role: 1 } },
      })
    );
    const spyFindOne = spyOn(db.Partners, "findOne").and.returnValue(
      Promise.resolve(null)
    );

    const spyHashPass = spyOn(bcryptServices, "hash").and.returnValue(
      Promise.resolve({ data: "hashed-pass" })
    );
    const spyCreate = spyOn(db.Partners, "create").and.returnValue(
      Promise.resolve({
        userName: "anyUsername",
        password: "hashed-pass",
        email: "anyEmail",
        id: 9999,
      })
    );
    const spyEjs = spyOn(ejs, "renderFile").and.stub();

    await partnerServices
      .createPartner(
        {
          userName: "anyUsername",
          password: "anyPassword",
          email: "anyEmail",
        },
        "token"
      )
      .then((result) => {
        expect(result.message).toBe("Create partner successful!");
        expect(result.data).toHaveProperties({
          id: 9999,
        });
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyFindOne).toHaveBeenCalledTimes(1);
        expect(spyFindOne).toHaveBeenCalledWith({
          where: {
            [Op.or]: [{ userName: "anyUsername" }, { email: "anyEmail" }],
          },
        });
        expect(spyHashPass).toHaveBeenCalledTimes(1);
        expect(spyHashPass).toHaveBeenCalledWith("anyPassword");
        expect(spyCreate).toHaveBeenCalledTimes(1);
        expect(spyCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({
            userName: "anyUsername",
            email: "anyEmail",
            password: "hashed-pass",
          })
        );
        expect(spyEjs).toHaveBeenCalledTimes(1);
      })
      .catch((err) => {
        fail("Should resolve value but reject found");
      });
  });
});
